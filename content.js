console.log("Content script loaded.");
if (typeof axe !== "undefined") {
    axe.run(document).then(results => {
        console.log("WCAG Violations:", results.violations);
    }).catch(err => console.error("Axe-core error:", err));
} else {
    console.error("Axe-core not loaded.");
}
