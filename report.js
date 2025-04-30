if (typeof axe !== "undefined") {
    axe.run(document).then(results => {
        
        

        console.log("%c Not Relevant", "background:rgb(71, 71, 71); padding: 10px 100px; color: white;");
        console.log(`Found ${results.inapplicable.length} rules irrevelant to this page`);
        results.inapplicable.forEach(pass => {
            console.log(`Pass: ${pass.description}`);
            console.log(`Tags: ${pass.tags.join(', ')}`);
            console.log("---------");
        });


        // First, log non-WCAG items
        console.log("%c Non-WCAG Items", "background: #8a8a8a; padding: 10px 100px; color: white;");
        const nonWcagPasses = results.passes.filter(pass => !pass.tags.some(tag => tag.startsWith('wcag')));
        const nonWcagViolations = results.violations.filter(violation => !violation.tags.some(tag => tag.startsWith('wcag')));
        const nonWcagIncomplete = results.incomplete.filter(incomplete => !incomplete.tags.some(tag => tag.startsWith('wcag')));
        
        
        console.log(`Found ${nonWcagPasses.length} non-WCAG passes`);
        nonWcagPasses.forEach(pass => {
            console.log(`Pass: ${pass.description}`);
            console.log(`Tags: ${pass.tags.join(', ')}`);
            console.log("---------");
        });
        
        console.log(`Found ${nonWcagViolations.length} non-WCAG violations`);
        nonWcagViolations.forEach(violation => {
            console.log(`Violation: ${violation.description}`);
            console.log(`Tags: ${violation.tags.join(', ')}`);
            console.log("---------");
        });
        
        console.log(`Found ${nonWcagIncomplete.length} non-WCAG items requiring manual check`);
        nonWcagIncomplete.forEach(incomplete => {
            console.log(`Incomplete: ${incomplete.description}`);
            console.log(`Tags: ${incomplete.tags.join(', ')}`);
            console.log("---------");
        });
        
        // Log WCAG passes
        console.log("%c WCAG Passes", "background: #4CAF50; padding: 10px 100px; color: white;");
        for (i in results.passes) {
            const pass = results.passes[i];
            const wcagNumbers = extractWcagNumbers(pass.tags);
            if (wcagNumbers.length > 0) {
                for (let j = 0; j < pass.nodes.length; j++) {
                    const nodeHtml = pass.nodes[j].html;
                    wcagNumbers.forEach(tag => {
                        console.log(pass.description);
                        console.log("WCAG Rule no:", tag, "|| Level:", getWcagLevel(pass.tags));
                        console.log("Passed HTML:", nodeHtml);
                        console.log("---------");
                    });
                }
            }
        }
        
        // Log WCAG incomplete items
        console.log("%c WCAG Manual Checks Needed", "background: #FF9800; padding: 10px 100px; color: white;");
        for(i in results.incomplete) {
            const incomplete = results.incomplete[i];
            const wcagNumbers = extractWcagNumbers(incomplete.tags);
            if (wcagNumbers.length > 0) {
                console.group(`Manual Check ${parseInt(i) + 1}: ${incomplete.description}`);
                
                for (let j = 0; j < incomplete.nodes.length; j++) {
                    const nodeHtml = incomplete.nodes[j].html;
                    wcagNumbers.forEach(tag => {
                        console.log("WCAG Rule no:", tag, "|| Level:", getWcagLevel(incomplete.tags));
                        console.log("HTML requiring manual verification:", nodeHtml);
                        
                        // Add guidance based on the type of issue
                        let guidance = "";
                        if (incomplete.description.includes("contrast")) {
                            guidance = "Verify that the contrast ratio meets WCAG requirements (4.5:1 for normal text, 3:1 for large text)";
                        } else if (incomplete.description.includes("heading")) {
                            guidance = "Verify that heading levels are appropriate and follow a logical hierarchy";
                        } else if (incomplete.description.includes("link")) {
                            guidance = "Verify that links have distinct accessible names and clear purpose from context";
                        } else if (incomplete.description.includes("image")) {
                            guidance = "Verify that images have appropriate alternative text that conveys the same information";
                        } else {
                            guidance = "Manual verification needed - review WCAG guidelines for this criteria";
                        }
                        
                        console.log("Developer action needed:", guidance);
                        console.log("---------");
                    });
                }
                
                console.groupEnd();
            }
        }

        // Log WCAG violations
        console.log("%c WCAG Violations", "background: #f44336; padding: 10px 100px; color: white;");
        for (i in results.violations) {
            const violation = results.violations[i];
            const wcagNumbers = extractWcagNumbers(violation.tags);
            if (wcagNumbers.length > 0) {
                console.group(`Violation ${parseInt(i) + 1}: ${violation.description}`);
                
                for (let j = 0; j < violation.nodes.length; j++) {
                    const nodeHtml = violation.nodes[j].html;
                    wcagNumbers.forEach(tag => {
                        console.log("WCAG Rule no:", tag, "|| Level:", getWcagLevel(violation.tags));
                        console.log("Problematic HTML:", nodeHtml);
                        
                        // Add guidance based on the type of issue
                        let guidance = "";
                        if (violation.description.includes("contrast")) {
                            guidance = "Increase the contrast ratio between text and background colors";
                        } else if (violation.description.includes("alt")) {
                            guidance = "Add descriptive alt text to images";
                        } else if (violation.description.includes("aria")) {
                            guidance = "Fix the ARIA attribute usage according to ARIA specification";
                        } else if (violation.description.includes("label")) {
                            guidance = "Ensure form controls have associated labels";
                        } else {
                            guidance = "Review WCAG documentation for this rule and make appropriate corrections";
                        }
                        
                        console.log("Developer guidance:", guidance);
                        console.log("---------");
                    });
                }
                
                console.groupEnd();
            }
        }
        console.log("No. of Passes:", results.passes.length);
        console.log("No. of Violations:", results.violations.length);
        console.log("No. of Incomplete:", results.incomplete.length);
    }).catch(err => console.error("Axe-core error:", err));
} else {
    console.error("Axe-core not loaded.");
}

function extractWcagNumbers(tags) {
    return tags
      .filter(tag => tag.startsWith("wcag"))
      .map(tag => {
        const parts = tag.match(/wcag(\d)(\d+)?/);
        if (parts) {
          const major = parts[1];
          const minor = parts[2] || "";
          return `${major}.${minor.split("").join(".")}`;
        }
        return null;
      })
      .filter(Boolean);
}

function getWcagLevel(tags) {
    if (tags.includes("wcag2aaa")) return "AAA";
    if (tags.includes("wcag2aa")) return "AA";
    if (tags.includes("wcag2a")) return "A";
    return "Unknown";
}