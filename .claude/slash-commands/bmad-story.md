# /bmad-story - Create BMAD Story

Create a new development story following BMAD methodology.

## Usage
```
/bmad-story <epic>.<story> "<title>" [priority]
```

## Examples
```
/bmad-story 1.3 "Implement recommendation algorithm" high
/bmad-story 2.1 "Build question flow interface" critical
```

## What this does:
1. Creates story file in `/ai/stories/story-{epic}.{story}.md`
2. Uses BMAD story template with acceptance criteria
3. Sets up task breakdown and estimates
4. Links to PRD and Architecture docs
5. Initializes with "Draft" status

## Template includes:
- Story description and user perspective
- Acceptance criteria (specific, testable)
- Technical requirements
- Task breakdown with estimates
- Definition of done checklist
- Dependencies and risks

## Next steps after creation:
1. Review and refine acceptance criteria
2. Set status to "In Progress" when ready
3. Use `/bmad-status` to track progress
4. Commit when story is complete

This command ensures consistent story structure and reduces setup time for each development task.
