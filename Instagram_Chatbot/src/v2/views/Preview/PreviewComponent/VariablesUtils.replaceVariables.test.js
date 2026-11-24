import { replaceVariables } from "./VariablesUtils";

describe("replaceVariables", () => {
  it("escapes HTML in substituted visitor answers", () => {
    const html = "<p>Hello {{name}}</p>";
    const variables = [
      { variable_name: "name", default_value: '<img src=x onerror="alert(1)">' },
    ];
    const out = replaceVariables(html, variables);
    expect(out).toBe(
      "<p>Hello &lt;img src=x onerror=&quot;alert(1)&quot;&gt;</p>"
    );
    expect(out).not.toContain("<img");
  });
});
