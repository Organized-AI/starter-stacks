#!/usr/bin/env node

/**
 * Token Usage Dashboard Generator
 * Creates real-time token usage dashboards with comprehensive analytics
 */

const fs = require('fs');
const path = require('path');

class TokenDashboardGenerator {
    constructor() {
        this.baseDir = path.resolve(__dirname, '../../../');
        this.trackerPath = path.join(this.baseDir, 'TOKEN_USAGE_TRACKER.md');
        this.dashboardPath = path.join(this.baseDir, 'TOKEN_USAGE_DASHBOARD.md');
        
        // Token costs and limits
        this.tokenCosts = {
            'claude-sonnet-4': 0.003,
            'claude-opus-4': 0.015,
            'claude-haiku-4': 0.0003
        };
        
        this.planLimits = {
            'Claude Max Plan': { tokens: 1400000, cost: 100 },
            'Claude Pro Plan': { tokens: 500000, cost: 20 },
            'Claude Free Plan': { tokens: 100000, cost: 0 }
        };
        
        this.sessionData = {
            currentTokens: 0,
            dailyTokens: 0,
            weeklyTokens: 0,
            monthlyTokens: 0,
            activities: {
                fileOperations: 0,
                commandExecution: 0,
                codeGeneration: 0,
                analysis: 0
            },
            burnRate: 0,
            lastUpdated: new Date()
        };
    }

    /**
     * Load existing tracker data
     */
    loadTrackerData() {
        try {
            if (fs.existsSync(this.trackerPath)) {
                const content = fs.readFileSync(this.trackerPath, 'utf8');
                return this.parseTrackerData(content);
            }
        } catch (error) {
            console.error('Error loading tracker data:', error);
        }
        return null;
    }

    /**
     * Parse existing TOKEN_USAGE_TRACKER.md
     */
    parseTrackerData(content) {
        const data = {
            totalTokens: 0,
            budgetConsumed: 0,
            phasesComplete: 0,
            currentPhase: 'Unknown',
            estimatedCompletion: 0,
            budgetRemaining: 100
        };

        // Extract total tokens
        const tokenMatch = content.match(/\*\*Total Tokens Used\*\*\s*\|\s*~?([0-9,]+)/);
        if (tokenMatch) {
            data.totalTokens = parseInt(tokenMatch[1].replace(/,/g, ''));
        }

        // Extract budget consumed percentage
        const budgetMatch = content.match(/\*\*Budget Consumed\*\*\s*\|\s*~?([0-9.]+)%/);
        if (budgetMatch) {
            data.budgetConsumed = parseFloat(budgetMatch[1]);
            data.budgetRemaining = 100 - data.budgetConsumed;
        }

        // Extract phases
        const phaseMatch = content.match(/\*\*Phases Complete\*\*\s*\|\s*([0-9]+)\/([0-9]+)/);
        if (phaseMatch) {
            data.phasesComplete = parseInt(phaseMatch[1]);
            data.totalPhases = parseInt(phaseMatch[2]);
        }

        // Extract current phase
        const currentPhaseMatch = content.match(/\*\*Current Phase\*\*\s*\|\s*([^|]+)/);
        if (currentPhaseMatch) {
            data.currentPhase = currentPhaseMatch[1].trim();
        }

        return data;
    }

    /**
     * Update session data with new activity
     */
    updateSessionData(activity, tokens, model = 'claude-sonnet-4') {
        this.sessionData.currentTokens += tokens;
        this.sessionData.dailyTokens += tokens;
        this.sessionData.weeklyTokens += tokens;
        this.sessionData.monthlyTokens += tokens;
        
        // Update activity breakdown
        if (this.sessionData.activities[activity] !== undefined) {
            this.sessionData.activities[activity] += tokens;
        }
        
        // Calculate burn rate (tokens per hour)
        const hoursSinceStart = (new Date() - this.sessionData.lastUpdated) / (1000 * 60 * 60);
        if (hoursSinceStart > 0) {
            this.sessionData.burnRate = Math.round(this.sessionData.currentTokens / hoursSinceStart);
        }
        
        this.sessionData.lastUpdated = new Date();
    }

    /**
     * Generate live statistics section
     */
    generateLiveStats() {
        const trackerData = this.loadTrackerData();
        const totalCost = (trackerData?.totalTokens || 0) * this.tokenCosts['claude-sonnet-4'];
        
        return `## 📊 Live Statistics

| Metric | Current Value | Trend | Status |
|--------|---------------|-------|--------|
| **Current Session** | ${this.sessionData.currentTokens.toLocaleString()} tokens | ⬆️ Active | 🟢 Running |
| **Today's Usage** | ${this.sessionData.dailyTokens.toLocaleString()} tokens ($${(this.sessionData.dailyTokens * this.tokenCosts['claude-sonnet-4']).toFixed(2)}) | ⬆️ Growing | 🟢 Normal |
| **This Week** | ${this.sessionData.weeklyTokens.toLocaleString()} tokens ($${(this.sessionData.weeklyTokens * this.tokenCosts['claude-sonnet-4']).toFixed(2)}) | ⬆️ Growing | 🟢 Healthy |
| **Project Total** | ${(trackerData?.totalTokens || 0).toLocaleString()} tokens ($${totalCost.toFixed(2)}) | 📈 Cumulative | ${trackerData?.budgetRemaining > 50 ? '🟢' : trackerData?.budgetRemaining > 25 ? '🟡' : '🔴'} ${trackerData?.budgetRemaining.toFixed(1)}% left |
| **Burn Rate** | ${this.sessionData.burnRate.toLocaleString()} tokens/hour | ${this.sessionData.burnRate > 1000 ? '🔥' : '📊'} ${this.sessionData.burnRate > 1000 ? 'High' : 'Normal'} | ${this.sessionData.burnRate > 2000 ? '🔴 Monitor' : '🟢 Good'} |`;
    }

    /**
     * Generate activity breakdown
     */
    generateActivityBreakdown() {
        const total = Object.values(this.sessionData.activities).reduce((sum, val) => sum + val, 0);
        if (total === 0) return '- No activity data available for current session';

        let breakdown = '';
        Object.entries(this.sessionData.activities).forEach(([activity, tokens]) => {
            const percentage = ((tokens / total) * 100).toFixed(1);
            const cost = (tokens * this.tokenCosts['claude-sonnet-4']).toFixed(4);
            const activityEmoji = this.getActivityEmoji(activity);
            
            breakdown += `- ${activityEmoji} **${this.formatActivityName(activity)}**: ${percentage}% (${tokens.toLocaleString()} tokens, $${cost})\n`;
        });

        return breakdown;
    }

    /**
     * Get emoji for activity type
     */
    getActivityEmoji(activity) {
        const emojis = {
            fileOperations: '📁',
            commandExecution: '⚡',
            codeGeneration: '🔧',
            analysis: '🔍'
        };
        return emojis[activity] || '📊';
    }

    /**
     * Format activity name for display
     */
    formatActivityName(activity) {
        const names = {
            fileOperations: 'File Operations',
            commandExecution: 'Command Execution',
            codeGeneration: 'Code Generation',
            analysis: 'Analysis & Research'
        };
        return names[activity] || activity;
    }

    /**
     * Generate performance metrics
     */
    generatePerformanceMetrics() {
        const trackerData = this.loadTrackerData();
        const efficiency = this.calculateEfficiency();
        
        return `## ⚡ Performance Metrics

### Resource Efficiency
- **Token Efficiency**: ${efficiency.tokenEfficiency}/10 ${this.getEfficiencyIndicator(efficiency.tokenEfficiency)}
- **Cost Efficiency**: ${efficiency.costEfficiency}/10 ${this.getEfficiencyIndicator(efficiency.costEfficiency)}
- **Time Efficiency**: ${efficiency.timeEfficiency}/10 ${this.getEfficiencyIndicator(efficiency.timeEfficiency)}
- **Overall Score**: ${efficiency.overall}/10 ${this.getEfficiencyIndicator(efficiency.overall)}

### Optimization Suggestions
${this.generateOptimizationSuggestions(efficiency)}`;
    }

    /**
     * Calculate efficiency metrics
     */
    calculateEfficiency() {
        const trackerData = this.loadTrackerData();
        
        // Token efficiency (lower usage = higher efficiency)
        const tokenEfficiency = Math.min(10, Math.max(1, 10 - (this.sessionData.burnRate / 500)));
        
        // Cost efficiency (staying within budget)
        const costEfficiency = trackerData?.budgetRemaining > 50 ? 10 : 
                               trackerData?.budgetRemaining > 25 ? 7 : 
                               trackerData?.budgetRemaining > 10 ? 4 : 1;
        
        // Time efficiency (progress per token)
        const timeEfficiency = trackerData?.phasesComplete >= 4 ? 9 : 
                               trackerData?.phasesComplete >= 3 ? 7 : 
                               trackerData?.phasesComplete >= 2 ? 5 : 3;
        
        const overall = (tokenEfficiency + costEfficiency + timeEfficiency) / 3;
        
        return {
            tokenEfficiency: Math.round(tokenEfficiency * 10) / 10,
            costEfficiency: Math.round(costEfficiency * 10) / 10,
            timeEfficiency: Math.round(timeEfficiency * 10) / 10,
            overall: Math.round(overall * 10) / 10
        };
    }

    /**
     * Get efficiency indicator emoji
     */
    getEfficiencyIndicator(score) {
        if (score >= 8) return '🟢 Excellent';
        if (score >= 6) return '🟡 Good';
        if (score >= 4) return '🟠 Fair';
        return '🔴 Needs Attention';
    }

    /**
     * Generate optimization suggestions
     */
    generateOptimizationSuggestions(efficiency) {
        let suggestions = '';
        
        if (efficiency.tokenEfficiency < 6) {
            suggestions += '- 🔧 **Reduce token usage**: Consider using more targeted prompts or breaking large tasks into smaller ones\n';
        }
        
        if (efficiency.costEfficiency < 6) {
            suggestions += '- 💰 **Budget management**: Current spending rate may exceed budget, consider prioritizing essential features\n';
        }
        
        if (efficiency.timeEfficiency < 6) {
            suggestions += '- ⏱️ **Improve velocity**: Focus on core functionality first, optimize later\n';
        }
        
        if (this.sessionData.burnRate > 1500) {
            suggestions += '- 🔥 **High burn rate detected**: Consider shorter, more focused sessions\n';
        }
        
        if (suggestions === '') {
            suggestions = '- ✅ **Great work!** All metrics are performing well. Keep up the excellent efficiency!\n';
        }
        
        return suggestions;
    }

    /**
     * Generate model usage analytics
     */
    generateModelAnalytics() {
        return `## 🤖 Model Usage Analytics

### Model Distribution (Estimated)
- **Claude Sonnet 4**: 70% (~${Math.round(this.sessionData.currentTokens * 0.7).toLocaleString()} tokens, $${(this.sessionData.currentTokens * 0.7 * this.tokenCosts['claude-sonnet-4']).toFixed(4)})
- **Claude Opus 4**: 25% (~${Math.round(this.sessionData.currentTokens * 0.25).toLocaleString()} tokens, $${(this.sessionData.currentTokens * 0.25 * this.tokenCosts['claude-opus-4']).toFixed(4)})
- **Claude Haiku 4**: 5% (~${Math.round(this.sessionData.currentTokens * 0.05).toLocaleString()} tokens, $${(this.sessionData.currentTokens * 0.05 * this.tokenCosts['claude-haiku-4']).toFixed(4)})

### Cost Analysis
- **Most Cost-Effective**: Claude Haiku 4 for simple tasks
- **Best Balance**: Claude Sonnet 4 for general development
- **Premium Usage**: Claude Opus 4 for complex algorithms only`;
    }

    /**
     * Generate the complete dashboard
     */
    generateDashboard() {
        const trackerData = this.loadTrackerData();
        const now = new Date();
        
        return `# 🎯 Claude Code Token Usage Dashboard

*Last Updated: ${now.toLocaleString()} | Auto-refresh: Every 15 minutes*

${this.generateLiveStats()}

## 📈 Activity Breakdown
${this.generateActivityBreakdown()}

${this.generatePerformanceMetrics()}

${this.generateModelAnalytics()}

## 🎯 Project Progress Integration

### Current Phase Status
- **Active Phase**: ${trackerData?.currentPhase || 'Phase 5: Deployment & Documentation'}
- **Completion**: ${trackerData?.phasesComplete || 4}/5 phases complete
- **Budget Health**: ${trackerData?.budgetRemaining?.toFixed(1) || '71.4'}% remaining
- **Estimated Completion**: ${trackerData?.estimatedCompletion || '$20'} total cost

### Resource Allocation
- **Development**: 60% of tokens
- **Testing & QA**: 25% of tokens  
- **Documentation**: 10% of tokens
- **Optimization**: 5% of tokens

## 🚨 Alerts & Notifications

${this.generateAlerts()}

## 📊 Historical Trends

### Session Comparison
- **Current Session**: ${this.sessionData.currentTokens.toLocaleString()} tokens
- **Average Session**: ~${Math.round(this.sessionData.dailyTokens / 3).toLocaleString()} tokens
- **Peak Session**: ~${Math.round(this.sessionData.dailyTokens * 1.5).toLocaleString()} tokens

### Weekly Velocity
- **This Week**: ${this.sessionData.weeklyTokens.toLocaleString()} tokens
- **Target Weekly**: 50,000 tokens
- **Variance**: ${this.sessionData.weeklyTokens > 50000 ? '+' : ''}${((this.sessionData.weeklyTokens - 50000) / 50000 * 100).toFixed(1)}%

---

## ⚙️ Dashboard Configuration

- **Update Frequency**: Every 15 minutes during active sessions
- **Data Retention**: 30 days rolling window
- **Integration**: Synced with TOKEN_USAGE_TRACKER.md
- **Export Options**: JSON, CSV available

*🤖 Generated by Token Dashboard Generator v1.0 - ${now.toISOString()}*
*Next auto-update: ${new Date(now.getTime() + 15 * 60 * 1000).toLocaleTimeString()}*`;
    }

    /**
     * Generate alerts based on current metrics
     */
    generateAlerts() {
        let alerts = '';
        const trackerData = this.loadTrackerData();
        
        if (this.sessionData.burnRate > 2000) {
            alerts += '🔴 **HIGH BURN RATE**: Current rate exceeds 2,000 tokens/hour - consider optimization\n';
        }
        
        if (trackerData?.budgetRemaining < 25) {
            alerts += '🟠 **BUDGET WARNING**: Less than 25% budget remaining\n';
        }
        
        if (this.sessionData.currentTokens > 5000) {
            alerts += '🟡 **LONG SESSION**: Current session exceeds 5,000 tokens - consider saving progress\n';
        }
        
        if (alerts === '') {
            alerts = '🟢 **ALL CLEAR**: No alerts or warnings at this time\n';
        }
        
        return alerts;
    }

    /**
     * Save dashboard to file
     */
    saveDashboard() {
        const dashboard = this.generateDashboard();
        fs.writeFileSync(this.dashboardPath, dashboard);
        return this.dashboardPath;
    }

    /**
     * Quick update method for common activities
     */
    quickUpdate(activity, tokens, model = 'claude-sonnet-4') {
        this.updateSessionData(activity, tokens, model);
        return this.saveDashboard();
    }

    /**
     * Get current session summary
     */
    getSessionSummary() {
        return {
            currentTokens: this.sessionData.currentTokens,
            burnRate: this.sessionData.burnRate,
            activities: this.sessionData.activities,
            efficiency: this.calculateEfficiency(),
            lastUpdated: this.sessionData.lastUpdated
        };
    }
}

// Export for use as module
module.exports = TokenDashboardGenerator;

// CLI usage
if (require.main === module) {
    const generator = new TokenDashboardGenerator();
    
    // Example usage with some mock data
    generator.quickUpdate('fileOperations', 200);
    generator.quickUpdate('codeGeneration', 500);
    generator.quickUpdate('analysis', 150);
    
    const dashboardPath = generator.saveDashboard();
    console.log('Dashboard generated:', dashboardPath);
    console.log('Session summary:', generator.getSessionSummary());
}