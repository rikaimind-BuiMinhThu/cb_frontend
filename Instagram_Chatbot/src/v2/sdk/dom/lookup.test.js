import { SEARCH_MODES } from "../constants";
import { findElementByAddress, getElementByAddress } from "./lookup";

const FIELD_ID = "lookup-field-id";
const FIELD_CLASS = "lookup-field-class";
const FIELD_VALUE = "lookup-value";
const FOREIGN_FIELD_ID = "foreign-lookup-field";
const MALFORMED_SELECTOR = "###";
const UNKNOWN_MODE = 99;

const appendTestField = ({ id, className, value }) => {
  const input = document.createElement("input");
  if (id) input.id = id;
  if (className) input.className = className;
  input.value = value;
  document.body.appendChild(input);
  return input;
};

describe("getElementByAddress", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("finds an element by ID in the default document", () => {
    appendTestField({ id: FIELD_ID, value: FIELD_VALUE });

    const element = getElementByAddress(SEARCH_MODES.ID, FIELD_ID);

    expect(element).not.toBeNull();
    expect(element.value).toBe(FIELD_VALUE);
  });

  it("finds an element by CSS selector in the default document", () => {
    appendTestField({ className: FIELD_CLASS, value: FIELD_VALUE });

    const element = getElementByAddress(
      SEARCH_MODES.CSS_SELECTOR,
      `.${FIELD_CLASS}`
    );

    expect(element).not.toBeNull();
    expect(element.value).toBe(FIELD_VALUE);
  });

  it("finds an element by XPath in the default document", () => {
    appendTestField({ id: FIELD_ID, value: FIELD_VALUE });

    const element = getElementByAddress(
      SEARCH_MODES.XPATH,
      `//*[@id="${FIELD_ID}"]`
    );

    expect(element).not.toBeNull();
    expect(element.value).toBe(FIELD_VALUE);
  });

  it("finds an element in a separate document root", () => {
    const foreignDocument =
      document.implementation.createHTMLDocument("foreign");
    const foreignInput = foreignDocument.createElement("input");
    foreignInput.id = FOREIGN_FIELD_ID;
    foreignInput.value = FIELD_VALUE;
    foreignDocument.body.appendChild(foreignInput);

    expect(getElementByAddress(SEARCH_MODES.ID, FOREIGN_FIELD_ID)).toBeNull();
    expect(
      getElementByAddress(SEARCH_MODES.ID, FOREIGN_FIELD_ID, foreignDocument)
    ).toBe(foreignInput);
  });

  it("returns null for empty mode, empty address, or null root", () => {
    appendTestField({ id: FIELD_ID, value: FIELD_VALUE });

    expect(getElementByAddress(null, FIELD_ID)).toBeNull();
    expect(getElementByAddress(SEARCH_MODES.ID, "")).toBeNull();
    expect(getElementByAddress(SEARCH_MODES.ID, FIELD_ID, null)).toBeNull();
  });

  it("throws on an unknown search mode", () => {
    expect(() => getElementByAddress(UNKNOWN_MODE, FIELD_ID)).toThrow(
      /Invalid search mode/
    );
  });
});

describe("findElementByAddress", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    jest.restoreAllMocks();
  });

  it("returns null and warns for an unknown mode", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    expect(findElementByAddress(UNKNOWN_MODE, FIELD_ID)).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0][1]).toEqual({
      mode: UNKNOWN_MODE,
      address: FIELD_ID,
    });
  });

  it("returns null and warns for a malformed CSS selector", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    expect(
      findElementByAddress(SEARCH_MODES.CSS_SELECTOR, MALFORMED_SELECTOR)
    ).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0][1]).toEqual({
      mode: SEARCH_MODES.CSS_SELECTOR,
      address: MALFORMED_SELECTOR,
    });
  });
});
