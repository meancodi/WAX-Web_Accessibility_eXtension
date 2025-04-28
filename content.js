if (typeof axe !== "undefined") {
    axe.run(document).then(results => {
        // Display passes
        console.log("%c Passes", "background: green; padding: 10px 100px; ");
        
        // Track unique pass descriptions and their associated rules
        const passDescriptions = new Map(); // Map of description -> array of rule numbers
        
        for (i in results.passes) {
            const pass = results.passes[i];
            const wcagNumbers = extractWcagNumbers(pass.tags);
            
            if (wcagNumbers.length > 0) {
                if (!passDescriptions.has(pass.description)) {
                    passDescriptions.set(pass.description, {
                        wcagRules: wcagNumbers,
                        level: getWcagLevel(pass.tags)
                    });
                } else {
                    // Add any new rule numbers to the existing array
                    const existingData = passDescriptions.get(pass.description);
                    wcagNumbers.forEach(num => {
                        if (!existingData.wcagRules.includes(num)) {
                            existingData.wcagRules.push(num);
                        }
                    });
                }
            }
        }
        
        // Display passes with all associated rules
        passDescriptions.forEach((data, description) => {
            console.log(description, "\n WCAG Rule(s):", data.wcagRules.join(", "), "|| Level:", data.level);
        });
        
        // Display violations
        console.log("%c Violations", "background:rgb(255, 0, 0); padding: 10px 100px; color: white;");
        
        if (results.violations.length > 0) {
            // Track unique violation descriptions and their associated rules
            const violationDescriptions = new Map(); // Map of description -> data about the violation
            const allViolations = [];
            
            // Process and organize violations
            for (i in results.violations) {
                const violation = results.violations[i];
                const wcagNumbers = extractWcagNumbers(violation.tags);
                
                if (wcagNumbers.length > 0) {
                    if (!violationDescriptions.has(violation.description)) {
                        violationDescriptions.set(violation.description, {
                            wcagRules: wcagNumbers,
                            level: getWcagLevel(violation.tags),
                            impact: violation.impact,
                            html: violation.nodes.map(node => node.html).join('\n'),
                            originalIndex: i
                        });
                    } else {
                        // Add any new rule numbers to the existing array
                        const existingData = violationDescriptions.get(violation.description);
                        wcagNumbers.forEach(num => {
                            if (!existingData.wcagRules.includes(num)) {
                                existingData.wcagRules.push(num);
                            }
                        });
                    }
                }
            }
            
            // Display violations first (before API call)
            let violationIndex = 1;
            violationDescriptions.forEach((data, description) => {
                console.group(`%c Violation ${violationIndex}: ${description}`, "color: #FF4500; font-weight: bold;");
                
                console.log(
                    `%c WCAG Details: %c${data.wcagRules.join(", ")} | Level ${data.level} | Impact: ${data.impact}`, 
                    "color: #FFFFFF; font-weight: bold;", 
                    "color: #FF4500;"
                );
                
                // Display the HTML causing the violation
                console.log("%c Problematic HTML:", "color:rgb(255, 233, 233); font-weight: bold;", data.html);
                
                console.groupEnd();
                
                // Prepare data for API request
                allViolations.push({
                    description: description,
                    wcagRule: data.wcagRules.join(", "),
                    level: data.level,
                    html: data.html,
                    impact: data.impact,
                    wcagVersion: data.wcagRules.map(getWcagVersion).join(", "),
                    originalIndex: parseInt(data.originalIndex)
                });
                
                violationIndex++;
            });
            
            if (allViolations.length > 0) {
                requestGeminiFixes(allViolations, results.violations);
            }
        } else {
            console.log("No violations found!");
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
    // Extract the WCAG version based on the rule number
    if (!ruleNumber) return "Unknown";
    
    const majorVersion = ruleNumber.charAt(0);
    
    if (majorVersion === "2") {
        const fullNumber = ruleNumber.replace(/\./g, "");
        // Rule numbers for WCAG 2.1 and 2.2 specific rules
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
    const API_KEY = CONFIG.API_KEY;
    const API_URL = `${CONFIG.API_URL}?key=${API_KEY}`;
    
    // Create a detailed prompt with all violations
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
    prompt += "CHANGES_MADE: [Specific changes made to fix the violation]\n\n";
    prompt += "VIOLATION_2:\n";
    prompt += "FIXED_HTML: [The complete corrected HTML with all necessary attributes]\n";
    prompt += "CHANGES_MADE: [Specific changes made to fix the violation]\n\n";
    prompt += "And so on for each violation. Be specific about which attributes or elements were modified.";
    prompt += "If a violation requires complex changes beyond simple HTML attribute fixes, please provide specific guidance about what needs to be changed instead of just 'No specific fix suggested'.";
    
    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: prompt
                    }
                ]
            }
        ]
    };
    
    
    console.log("%c Suggesting Fixes", "background: #1E90FF; padding: 10px 100px; color: white;");
    
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (aiResponse) {
            displayViolationsWithFixes(violationsData, aiResponse);
        } else {
            console.error("No valid response received from Gemini API");
        }
    })
    .catch(error => {
        console.error("Error calling Gemini API:", error);
    });
}

function displayViolationsWithFixes(violationsData, aiResponse) {
    console.log("%c Violations with Suggested Fixes", "background:rgb(0, 76, 255); color: white; padding: 10px 100px;");
    
    // Extract fixes for each violation from the response
    const fixesByViolation = parseGeminiFixes(aiResponse, violationsData.length);
    
    // Display each violation with its suggested fix
    violationsData.forEach((violation, index) => {
        console.group(`%c Violation ${index + 1}: ${violation.description}`, "color: #FF4500; font-weight: bold;");
        
        // Display the WCAG details including all associated rule numbers
        console.log(
            `%c WCAG Details: %c${violation.wcagRule} | ${violation.wcagVersion} | Level ${violation.level} | Impact: ${violation.impact}`, 
            "color: #FFFFFF; font-weight: bold;", 
            "color: #FF4500;"
        );
        
        // Skip displaying the HTML again as it was already shown in the first violations log
        
        // Display the suggested fix with both fixed HTML and change explanation
        const fix = fixesByViolation[index];
        if (fix) {
            if (fix.fixedHtml && fix.fixedHtml !== "No specific fix suggested") {
                console.log("%c Fixed HTML:", "color:rgb(9, 161, 237); font-weight: bold;", fix.fixedHtml);
            }
            if (fix.changesMade && fix.changesMade !== "No specific fix suggested") {
                console.log("%c Changes Made:", "color:rgb(212, 153, 255); font-weight: bold;", fix.changesMade);
            }
            
            if ((!fix.fixedHtml || fix.fixedHtml === "No specific fix suggested") && 
                (!fix.changesMade || fix.changesMade === "No specific fix suggested")) {
                console.log(
                    "%c Developer Guidance: %c No simple HTML attribute fix available. This issue requires structural or contextual changes to the page.", 
                    "color: #008080; font-weight: bold;", 
                    "color: #FFFFFF;"
                );
                
                // Provide specific guidance based on the violation type
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
                
                console.log("%c Recommended approach: %c" + guidance, "color: #008080; font-weight: bold;", "color: #333;");
            }
        } else {
            console.log(
                "%c Developer Guidance: %c This issue requires careful examination of the page structure and context. Consider reviewing the WCAG guidelines for this specific rule.", 
                "color: #008080; font-weight: bold;", 
                "color: #FFFFFF;"
            );
        }
        
        console.groupEnd();
    });
}

function parseGeminiFixes(aiResponse, violationCount) {
    const fixes = [];
    
    for (let i = 1; i <= violationCount; i++) {
        // Pattern to match the entire violation section
        const violationRegexPatterns = [
            new RegExp(`VIOLATION_${i}:\\s*([\\s\\S]*?)(?=VIOLATION_${i+1}:|$)`, 's'),
            new RegExp(`VIOLATION ${i}:\\s*([\\s\\S]*?)(?=VIOLATION ${i+1}:|$)`, 's'),
            new RegExp(`Violation ${i}:\\s*([\\s\\S]*?)(?=Violation ${i+1}:|$)`, 's')
        ];
        
        let violationSection = null;
        
        // Find the whole section for this violation
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
            const changesMade = changesMadeMatch ? changesMadeMatch[1].trim() : null;
            
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