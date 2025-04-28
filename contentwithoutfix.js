if (typeof axe !== "undefined") {
    axe.run(document).then(results => {
        console.log("%c Passes", "background: green; padding: 10px 100px; ");
        for (i in results.passes) {
            const pass = results.passes[i];
            extractWcagNumbers(pass.tags).forEach(tag => {
                console.log(pass.description,"\n WCAG Rule no:", tag, "|| Level:", getWcagLevel(pass.tags)); 
            });
        }
        console.log("%c Violations", "background: red; padding: 10px 100px; ");
        for (i in results.violations) {
            const violation = results.violations[i];
            extractWcagNumbers(violation.tags).forEach(tag => {
                console.log(violation.description,"\n WCAG Rule no:", tag, "|| Level:", getWcagLevel(violation.tags)); 
            });
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
  