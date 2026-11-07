import {
  callIfFunction,
  COMBINE_USER_BLOCK_ON_RENDER_COMPLETED,
} from "./callIfFunction";

describe("callIfFunction", () => {
  it("calls the function when provided", () => {
    const fn = jest.fn();
    expect(callIfFunction(fn, "a", 1)).toBe(true);
    expect(fn).toHaveBeenCalledWith("a", 1);
  });

  it("skips when onRenderCompleted is undefined", () => {
    expect(callIfFunction(undefined)).toBe(false);
  });

  it("skips when onRenderCompleted is not a function", () => {
    expect(callIfFunction(null)).toBe(false);
    expect(callIfFunction("next")).toBe(false);
  });
});

describe("COMBINE_USER_BLOCK_ON_RENDER_COMPLETED", () => {
  it("does not advance chat when an image user block mounts inside combine", () => {
    let advanced = false;
    const renderNextMessage = () => {
      advanced = true;
    };

    // Combine must pass the noop, never renderNextMessage.
    callIfFunction(COMBINE_USER_BLOCK_ON_RENDER_COMPLETED);
    expect(advanced).toBe(false);

    callIfFunction(renderNextMessage);
    expect(advanced).toBe(true);
  });
});
