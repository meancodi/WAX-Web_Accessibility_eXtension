if (typeof axe !== "undefined") {
    axe.run(document).then(results => {
        console.log("Results", results);
        
        // First, log non-WCAG items
        const nonWcagPasses = results.passes.filter(pass => !pass.tags.some(tag => tag.startsWith('wcag')));
        const nonWcagViolations = results.violations.filter(violation => !violation.tags.some(tag => tag.startsWith('wcag')));
        const nonWcagIncomplete = results.incomplete.filter(incomplete => !incomplete.tags.some(tag => tag.startsWith('wcag')));

        console.log("%c Not Relevant", "background:rgb(71, 71, 71); padding: 10px 100px; color: white;");
        console.log(`Found ${results.inapplicable.length} rules irrevelant to this page`);
        results.inapplicable.forEach(pass => {
            console.log(`Pass: ${pass.description}`);
            console.log(`Tags: ${pass.tags.join(', ')}`);
            console.log("---------");
        });

        console.log("%c Non-WCAG Passes", "background:rgb(162, 220, 135); padding: 10px 100px; color: white;");
        console.log(`Found ${nonWcagPasses.length} non-WCAG passes`);
        nonWcagPasses.forEach(pass => {
            console.log(`Pass: ${pass.description}`);
            console.log(`Tags: ${pass.tags.join(', ')}`);
            console.log("---------");
        });
        
        console.log("%c Non-WCAG Violations", "background:rgb(242, 113, 113); padding: 10px 100px; color: white;");
        console.log(`Found ${nonWcagViolations.length} non-WCAG violations`);
        nonWcagViolations.forEach(violation => {
            console.log(`Violation: ${violation.description}`);
            console.log(`Tags: ${violation.tags.join(', ')}`);
            console.log("---------");
        });
        
        console.log("%c Non-WCAG Manual Checks required", "background:rgb(207, 125, 203); padding: 10px 100px; color: white;");
        console.log(`Found ${nonWcagIncomplete.length} non-WCAG items requiring manual check`);
        nonWcagIncomplete.forEach(incomplete => {
            console.log(`Incomplete: ${incomplete.description}`);
            console.log(`Tags: ${incomplete.tags.join(', ')}`);
            console.log("---------");
        });
        
        // Now, log WCAG passes
        console.log("%c WCAG Passes", "background: #4CAF50; padding: 10px 100px; color: white;");
        
        for (i in results.passes) {
            const pass = results.passes[i];
            const wcagNumbers = extractWcagNumbers(pass.tags);
            
            if (wcagNumbers.length > 0) {
                for (let j = 0; j < pass.nodes.length; j++) {
                    const nodeHtml = pass.nodes[j].html;
                    console.log(pass.description);
                    // Show WCAG version alongside rule numbers
                    const wcagVersionsWithRules = wcagNumbers.map(num => {
                        return `${num} (${getWcagVersion(num)})`;
                    }).join(", ");
                    console.log("WCAG Rule(s):", wcagVersionsWithRules, "|| Level:", getWcagLevel(pass.tags));
                    console.log("Passed HTML:", nodeHtml);
                    console.log("---------");
                }
            }
        }
        
        // Log WCAG incomplete items
        console.log("%c WCAG Manual Checks Needed", "background: #FF9800; padding: 10px 100px; color: white;");
        
        for (i in results.incomplete) {
            const incomplete = results.incomplete[i];
            const wcagNumbers = extractWcagNumbers(incomplete.tags);
            
            if (wcagNumbers.length > 0) {
                console.group(`Manual Check ${parseInt(i) + 1}: ${incomplete.description}`);
                
                // Show WCAG version alongside rule numbers
                const wcagVersionsWithRules = wcagNumbers.map(num => {
                    return `${num} (${getWcagVersion(num)})`;
                }).join(", ");
                console.log(
                    `WCAG Details: ${wcagVersionsWithRules} | Level ${getWcagLevel(incomplete.tags)}`
                );
                
                for (let j = 0; j < incomplete.nodes.length; j++) {
                    const nodeHtml = incomplete.nodes[j].html;
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
                }
                
                console.groupEnd();
            }
        }
        
        // Log WCAG violations
        console.log("%c WCAG Violations", "background: #f44336; padding: 10px 100px; color: white;");
        
        if (results.violations.length > 0) {
            const allViolations = [];
            
            for (i in results.violations) {
                const violation = results.violations[i];
                const wcagNumbers = extractWcagNumbers(violation.tags);
                
                if (wcagNumbers.length > 0) {
                    console.group(`Violation ${parseInt(i) + 1}: ${violation.description}`);
                    
                    // Show WCAG version alongside rule numbers
                    const wcagVersionsWithRules = wcagNumbers.map(num => {
                        return `${num} (${getWcagVersion(num)})`;
                    }).join(", ");
                    console.log(
                        `WCAG Details: ${wcagVersionsWithRules} | Level ${getWcagLevel(violation.tags)} | Impact: ${violation.impact}`
                    );
                    
                    for (let j = 0; j < violation.nodes.length; j++) {
                        const nodeHtml = violation.nodes[j].html;
                        console.log("Problematic HTML:", nodeHtml);
                        
                        // Display problematic HTML attributes if available
                        try {
                            const htmlElement = document.createElement('div');
                            htmlElement.innerHTML = nodeHtml;
                            const problematicElement = htmlElement.firstElementChild;
                            
                            if (problematicElement && problematicElement.attributes && problematicElement.attributes.length > 0) {
                                console.log("HTML Attributes:");
                                for (let k = 0; k < problematicElement.attributes.length; k++) {
                                    const attr = problematicElement.attributes[k];
                                    console.log(`- ${attr.name}: "${attr.value}"`);
                                }
                            }
                        } catch (err) {
                            // Silently handle errors in attribute parsing
                        }
                        
                        allViolations.push({
                            description: violation.description,
                            wcagRule: wcagNumbers.join(", "),
                            level: getWcagLevel(violation.tags),
                            html: nodeHtml,
                            impact: violation.impact,
                            wcagVersion: wcagNumbers.map(getWcagVersion).join(", "),
                            originalIndex: parseInt(i),
                            nodeIndex: j,
                            nodes: violation.nodes
                        });
                    }
                    
                    console.groupEnd();
                }
            }
            
            if (allViolations.length > 0) {
                requestGeminiFixes(allViolations, results.violations);
            }
        } else {
            console.log("No WCAG violations found!");
        }
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

function getWcagVersion(ruleNumber) {
    if (!ruleNumber) return "Unknown";
    
    const majorVersion = ruleNumber.charAt(0);
    
    if (majorVersion === "2") {
        const fullNumber = ruleNumber.replace(/\./g, "");
        const wcag21Rules = ["21", "22", "23", "24", "25", "26", "27", "28", "29", "210", "211", "212", "213"];
        const wcag22Rules = ["214", "215", "216", "217", "218"];
        
        if (wcag22Rules.some(rule => fullNumber.startsWith(rule))) {
            return "WCAG 2.2";
        } else if (wcag21Rules.some(rule => fullNumber.startsWith(rule))) {
            return "WCAG 2.1";
        } else {
            return "WCAG 2.0";
        }
    }
    
    return "Unknown";
}



function requestGeminiFixes(violationsData, originalViolations) {
    try {
        const API_KEY = CONFIG.API_KEY;
        const API_URL = `${CONFIG.API_URL}?key=${API_KEY}`;
        
        let prompt = "As an accessibility expert, provide detailed fixes for each of these WCAG violations:\n\n";
        
        violationsData.forEach((violation, index) => {
            prompt += `Violation ${index + 1}:\n`;
            prompt += `Description: ${violation.description}\n`;
            prompt += `WCAG Rule: ${violation.wcagRule}\n`;
            prompt += `Level: ${violation.level}\n`;
            prompt += `Impact: ${violation.impact}\n`;
            prompt += `HTML: ${violation.html}\n\n`;
        });

        prompt += "For each violation, provide your response in this exact format:\n";
        prompt += "VIOLATION_1:\n";
        prompt += "FIXED_HTML: [The complete corrected HTML with all necessary attributes]\n";
        prompt += "CHANGES_MADE: [Specific changes made to fix the violation - clearly highlight ORIGINAL vs NEW attributes]\n\n";
        prompt += "And so on for each violation. Use the format 'ORIGINAL: [old value] → NEW: [new value]' when describing attribute changes.";

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.2,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192
            }
        };

        console.log("%c Generating Accessibility Fixes", "background: #2196F3; padding: 10px 100px; color: white;");

        const dotInterval = setInterval(() => {
            console.log(' seconds...');
        }, 1000);

        const makeApiRequest = () => {
            return fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            })
            .then(response => {
                clearInterval(dotInterval); // Stop dot logging on response
                if (!response.ok) {
                    console.error(`API request failed with status: ${response.status}`);
                    return response.text().then(errorText => {
                        console.error("Error details:", errorText);
                        throw new Error(`API request failed with status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                let aiResponse;
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    aiResponse = data.candidates[0].content.parts[0].text;
                } else if (data.text) {
                    aiResponse = data.text;
                } else if (data.response) {
                    aiResponse = data.response;
                }

                if (aiResponse) {
                    displayViolationsWithFixes(violationsData, aiResponse);
                } else {
                    console.error("No valid response received from Gemini API");
                    console.error("Full response:", data);
                    throw new Error("Invalid response format");
                }
            })
            .catch(error => {
                clearInterval(dotInterval); // Stop dot logging on error
                console.error("Error calling Gemini API:", error);

                    console.log("%c API Error", "background: #f44336; color: white; padding: 10px;", 
                        "\nThe accessibility fixes could not be loaded. This might be due to:\n" +
                        "1. Invalid or expired API key\n" +
                        "2. Network connectivity issues\n" +
                        "3. Gemini API service disruption\n\n" +
                        "Please check your API key in config.js and try again."
                    );

                    displayViolationsWithoutFixes(violationsData);
                
            });
        };

        makeApiRequest();
    } catch (error) {
        console.error("Error setting up Gemini API request:", error);
        displayViolationsWithoutFixes(violationsData);
    }
}


function displayViolationsWithoutFixes(violationsData) {
    console.log("%c Violations (No Fixes Available)", "background: #FF9800; color: white; padding: 10px 100px;");
    
    violationsData.forEach((violation, index) => {
        console.group(`Violation ${index + 1}: ${violation.description}`);
        
        console.log(
            `WCAG Details: ${violation.wcagRule} | ${violation.wcagVersion} | Level ${violation.level} | Impact: ${violation.impact}`
        );
        
        console.log("Problematic HTML:", violation.html);
        
        console.log(
            "Developer Guidance: Review the WCAG documentation for this specific rule."
        );
        
        console.groupEnd();
    });
}

function displayViolationsWithFixes(violationsData, aiResponse) {
    console.log("%c Violations with Suggested Fixes", "background: #4CAF50; color: white; padding: 10px 100px;");
    
    const fixesByViolation = parseGeminiFixes(aiResponse, violationsData.length);
    
    violationsData.forEach((violation, index) => {
        console.group(`Violation ${index + 1}: ${violation.description}`);
        
        console.log(
            `WCAG Details: ${violation.wcagRule} | ${violation.wcagVersion} | Level ${violation.level} | Impact: ${violation.impact}`
        );
        
        // Display problematic HTML with highlighted attributes if available
        if (violation.nodes && violation.nodes.length > 0) {
            console.log("Original HTML:", violation.html);
            
            // Try to highlight problematic attributes
            try {
                const htmlElement = document.createElement('div');
                htmlElement.innerHTML = violation.html;
                const problematicElement = htmlElement.firstElementChild;
                
                if (problematicElement && problematicElement.attributes) {
                    console.log("HTML Attributes:");
                    for (let i = 0; i < problematicElement.attributes.length; i++) {
                        const attr = problematicElement.attributes[i];
                        console.log(`- ${attr.name}: "${attr.value}"`);
                    }
                }
            } catch (err) {
                // Silently handle errors in attribute parsing
            }
        } else {
            console.log("Original HTML:", violation.html);
        }
        
        const fix = fixesByViolation[index];
        if (fix) {
            if (fix.fixedHtml && fix.fixedHtml !== "No specific fix suggested") {
                console.log("Fixed HTML:", fix.fixedHtml);
                
                // Try to highlight what attributes changed
                try {
                    const originalElement = document.createElement('div');
                    originalElement.innerHTML = violation.html;
                    const original = originalElement.firstElementChild;
                    
                    const fixedElement = document.createElement('div');
                    fixedElement.innerHTML = fix.fixedHtml;
                    const fixed = fixedElement.firstElementChild;
                    
                    if (original && fixed && original.attributes && fixed.attributes) {
                        const originalAttrs = {};
                        const fixedAttrs = {};
                        
                        for (let i = 0; i < original.attributes.length; i++) {
                            originalAttrs[original.attributes[i].name] = original.attributes[i].value;
                        }
                        
                        for (let i = 0; i < fixed.attributes.length; i++) {
                            fixedAttrs[fixed.attributes[i].name] = fixed.attributes[i].value;
                        }
                        
                        // Find new or modified attributes
                        console.log("Attribute Changes:");
                        let attributeChangesFound = false;
                        
                        for (const attrName in fixedAttrs) {
                            if (!originalAttrs.hasOwnProperty(attrName)) {
                                console.log(`- ADDED: ${attrName}="${fixedAttrs[attrName]}"`);
                                attributeChangesFound = true;
                            } else if (originalAttrs[attrName] !== fixedAttrs[attrName]) {
                                console.log(`- MODIFIED: ${attrName}="${originalAttrs[attrName]}" → "${fixedAttrs[attrName]}"`);
                                attributeChangesFound = true;
                            }
                        }
                        
                        // Find removed attributes
                        for (const attrName in originalAttrs) {
                            if (!fixedAttrs.hasOwnProperty(attrName)) {
                                console.log(`- REMOVED: ${attrName}="${originalAttrs[attrName]}"`);
                                attributeChangesFound = true;
                            }
                        }
                        
                        if (!attributeChangesFound) {
                            console.log("- No attribute changes detected. Structural or content changes may be present.");
                        }
                    }
                } catch (err) {
                    // Silently handle errors in attribute comparison
                }
            }
            
            if (fix.changesMade && fix.changesMade !== "No specific fix suggested") {
                console.log("Changes Made:", fix.changesMade);
            }
            
            if ((!fix.fixedHtml || fix.fixedHtml === "No specific fix suggested") && 
                (!fix.changesMade || fix.changesMade === "No specific fix suggested")) {
                console.log(
                    "Developer Guidance: No simple HTML attribute fix available. This issue requires structural or contextual changes to the page."
                );
                
                let guidance = "";
                
                if (violation.description.includes("interactive controls")) {
                    guidance = "Avoid nesting interactive elements like buttons inside links or vice versa. Each interactive element should have a single clear purpose and role.";
                } else if (violation.description.includes("color contrast")) {
                    guidance = "Increase the contrast ratio between text and background colors to meet WCAG requirements (4.5:1 for normal text, 3:1 for large text).";
                } else if (violation.description.includes("landmark")) {
                    guidance = "Ensure proper use of ARIA landmarks or HTML5 semantic elements to define the structure of the page.";
                } else if (violation.description.includes("keyboard")) {
                    guidance = "Ensure all interactive elements can be accessed and operated using only a keyboard.";
                } else if (violation.description.includes("focus")) {
                    guidance = "Make sure all interactive elements have a visible focus indicator and proper focus management.";
                } else {
                    guidance = "Review the WCAG documentation for this specific rule and consider consulting with an accessibility expert.";
                }
                
                console.log("Recommended approach:", guidance);
            }
        } else {
            console.log(
                "Developer Guidance: This issue requires careful examination of the page structure and context. Consider reviewing the WCAG guidelines for this specific rule."
            );
        }
        
        console.groupEnd();
    });
    console.log("Total Violations Found:", violationsData.length);
    console.log("Violations With Suggested Fixes:", fixesByViolation.filter(Boolean).length);
}

function parseGeminiFixes(aiResponse, violationCount) {
    const fixes = [];
    
    for (let i = 1; i <= violationCount; i++) {
        const violationRegexPatterns = [
            new RegExp(`VIOLATION_${i}:\\s*([\\s\\S]*?)(?=VIOLATION_${i+1}:|$)`, 's'),
            new RegExp(`VIOLATION ${i}:\\s*([\\s\\S]*?)(?=VIOLATION ${i+1}:|$)`, 's'),
            new RegExp(`Violation ${i}:\\s*([\\s\\S]*?)(?=Violation ${i+1}:|$)`, 's')
        ];
        
        let violationSection = null;
        
        for (const regex of violationRegexPatterns) {
            const match = aiResponse.match(regex);
            if (match && match[1]) {
                violationSection = match[1].trim();
                break;
            }
        }
        
        if (violationSection) {
            const fixedHtmlMatch = violationSection.match(/FIXED_HTML:\s*([\s\S]*?)(?=CHANGES_MADE:|$)/i);
            const fixedHtml = fixedHtmlMatch ? fixedHtmlMatch[1].trim() : null;
            
            const changesMadeMatch = violationSection.match(/CHANGES_MADE:\s*([\s\S]*?)(?=$)/i);
            let changesMade = changesMadeMatch ? changesMadeMatch[1].trim() : null;
            
            // Remove markdown formatting from changesMade
            if (changesMade) {
                // Remove markdown bullet points
                changesMade = changesMade.replace(/^\s*\*\s+/gm, '');
                
                // Remove markdown emphasis/bold formatting
                changesMade = changesMade.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1');
                
                // Remove backticks
                changesMade = changesMade.replace(/`([^`]+)`/g, '$1');
                
                // Format ADDED/MODIFIED/REMOVED entries for better readability
                const addedPattern = /ADDED:\s*([^\n]+)/gi;
                const modifiedPattern = /MODIFIED:\s*([^\n]+)/gi;
                const removedPattern = /REMOVED:\s*([^\n]+)/gi;
                
                // Replace with non-markdown formatted versions
                changesMade = changesMade.replace(addedPattern, "ADDED: $1");
                changesMade = changesMade.replace(modifiedPattern, "MODIFIED: $1");
                changesMade = changesMade.replace(removedPattern, "REMOVED: $1");
                
                // Clean up unnecessary markdown arrows if present
                changesMade = changesMade.replace(/→/g, "->");
            }
            
            fixes.push({
                fixedHtml,
                changesMade
            });
        } else {
            fixes.push(null);
        }
    }
    
    return fixes;
}