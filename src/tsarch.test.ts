import "tsarch/dist/jest"
import {filesOfProject, slicesOfProject, } from "tsarch"

describe("architecture", () => {
    it("TODO1", async () => {
        const violations = await filesOfProject()
            .inFolder("controllers")
            .should()
            .matchPattern(".*Controller\.ts")
            .check()

        await expect(violations).toEqual([])
    })
    it("TODO2", async () => {
        const violations = await filesOfProject()
            .matchingPattern(".*")
            .should()
            .beFreeOfCycles()
            .check()
        await expect(violations).toEqual([{
            "cycle": [{
                "cumulatedEdges": [{
                    "external": false,
                    "source": "src/services/Service.ts",
                    "target": "src/controllers/Controller.ts"
                }], "sourceLabel": "src/services/Service.ts", "targetLabel": "src/controllers/Controller.ts"
            }, {
                "cumulatedEdges": [{
                    "external": false,
                    "source": "src/controllers/Controller.ts",
                    "target": "src/services/Service.ts"
                }], "sourceLabel": "src/controllers/Controller.ts", "targetLabel": "src/services/Service.ts"
            }]
        }])
    })
	it("TODO3", async () => {

		const rule = (await filesOfProject())
			.inFolder("services")
			.should()
			.matchPattern(".*Service\.ts")

		await expect(rule).not.toPassAsync()
	})

	it("TODO4", async () => {

		const violations =await slicesOfProject()
			.definedBy("src/(**)/")
			.shouldNot()
			.containDependency("services", "controllers")
			.check()
		expect(violations).toContainEqual({
			projectedEdge: {
				sourceLabel: "services",
				targetLabel: "controllers",
				cumulatedEdges: [
					{
						source: "src/services/Service.ts",
						target: "src/controllers/Controller.ts",
						external: false
					}
				]
			},
			rule: { source: "services", target: "controllers" }
		})
	})
	it("TODO5", async () => {
		const diagram = `
@startuml
  component [controllers]
  component [services]
  [controllers] --> [services]
@enduml
        `
		const violations = await slicesOfProject()
			.definedBy("src/(**)/")
			.should()
			.adhereToDiagram(diagram)
			.check()
		console.log(violations);
		expect(violations).toContainEqual({
			rule: null,
			projectedEdge: {
				sourceLabel: "services",
				targetLabel: "controllers",
				cumulatedEdges: [
					{
						source: "src/services/Service.ts",
						target: "src/controllers/Controller.ts",
						external: false
					}
				]
			}
		})
	})
})
