// Page.navigate acknowledges navigation before document load/hydration finishes.
// A prior page can already expose Pro controls, so bind readiness to this route.
export function journeyReadyExpression(url,slug) {
 return `location.href===${JSON.stringify(url)}&&document.readyState==="complete"&&document.querySelector("main")?.dataset.calculatorSlug===${JSON.stringify(slug)}&&document.querySelector("#plan")?.textContent==="pro"&&!!document.querySelector(".calculator-ui")`;
}
