document.querySelector(".example").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission and page refresh
    const searchInput = document.querySelector("input[name='search']").value.trim();
    if (!searchInput) {
        alert("Please enter a search term!");
        return;
    }

    // Selected content areas to search
    const contentAreas = document.querySelectorAll(".introduction-container, .pipeline-explanation");
    let found = false;
    let firstHighlighted = null;

    // Remove previous highlights
    document.querySelectorAll(".highlight").forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize();
    });

    contentAreas.forEach(area => {
        // Select elements to search
        const paragraphs = area.querySelectorAll("p, h2, h3, h4, li");
        const filteredParagraphs = Array.from(paragraphs).filter(paragraph => {
            return !(paragraph.matches(".introduction-container h2") || paragraph.matches(".introduction-container p:last-child"));
        });

        // Regular expression for keywords
        const regex = new RegExp(`(${searchInput})`, "gi");

        filteredParagraphs.forEach(paragraph => {
            if (highlightMatches(paragraph, regex) && !firstHighlighted) {
                firstHighlighted = paragraph.querySelector(".highlight");
            }
            found = true;
        });
    });

    // Scroll to the first match
    if (firstHighlighted) {
        firstHighlighted.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (!found) {
        alert("No matching content found!");
    }
});

// Function to highlight matching text
function highlightMatches(element, regex) {
    let hasMatch = false;
    element.childNodes.forEach(node => {
        if (node.nodeType === 3) {
            const matches = node.nodeValue.match(regex);
            if (matches) {
                hasMatch = true;
                const newHTML = node.nodeValue.replace(regex, `<span class="highlight">$1</span>`);
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = newHTML;
                while (tempDiv.firstChild) {
                    node.parentNode.insertBefore(tempDiv.firstChild, node);
                }
                node.parentNode.removeChild(node);
            }
        } else if (node.nodeType === 1 && node.tagName !== "SCRIPT") {
            if (highlightMatches(node, regex)) {
                hasMatch = true;
            }
        }
    });
    return hasMatch;
}
