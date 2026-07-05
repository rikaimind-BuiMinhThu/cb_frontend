import {
  buildSdkPostMessageLayout,
  computeClosedContentSize,
  computeOpenIframeSize,
  formatClosedIframeSize,
  getClosedIframeDimensions,
  getClosedLauncherPosition,
} from './sdkLayoutUtils';

describe('sdkLayoutUtils', () => {
  describe('computeClosedContentSize', () => {
    it('returns desktop bar launcher size', () => {
      expect(computeClosedContentSize({
        isMobile: false,
        position: 1,
        buttonType: 1,
      })).toEqual({ width: 360, height: 66 });
    });

    it('returns desktop circle launcher size', () => {
      expect(computeClosedContentSize({
        isMobile: false,
        position: 1,
        buttonType: 2,
      })).toEqual({ width: 56, height: 56 });
    });

    it('returns desktop vertical tab size with overflow room', () => {
      expect(computeClosedContentSize({
        isMobile: false,
        position: 2,
        buttonType: 1,
      })).toEqual({ width: 420, height: 300 });
    });

    it('returns mobile fullwidth bar launcher size', () => {
      expect(computeClosedContentSize({
        isMobile: true,
        position: 1,
        buttonType: 1,
        useFullWidthMobile: true,
      })).toEqual({ width: '100%', height: 75 });
    });
  });

  describe('computeOpenIframeSize', () => {
    it('returns desktop pixel dimensions', () => {
      expect(computeOpenIframeSize({
        isMobile: false,
        widthPc: 380,
        heightPc: 620,
      })).toEqual({ width: 380, height: 620 });
    });

    it('returns mobile percentage dimensions', () => {
      expect(computeOpenIframeSize({
        isMobile: true,
        widthSp: 90,
        heightSp: 80,
      })).toEqual({ width: '90%', height: '80%' });
    });
  });

  describe('getClosedIframeDimensions', () => {
    it('falls back to legacy desktop defaults', () => {
      expect(getClosedIframeDimensions({ isMobile: false })).toEqual({
        width: 400,
        height: 85,
      });
    });

    it('uses postMessage content dimensions when provided', () => {
      expect(getClosedIframeDimensions({
        closedContentWidth: 56,
        closedContentHeight: 56,
        isMobile: false,
      })).toEqual({
        width: 56,
        height: 56,
      });
    });
  });

  describe('formatClosedIframeSize', () => {
    it('adds horizontal and bottom offsets for numeric content size', () => {
      expect(formatClosedIframeSize(
        { width: 360, height: 66 },
        { mode: 'right', rightPx: 10, leftPx: 0 },
        5,
      )).toEqual({
        width: '370px',
        height: '71px',
      });
    });
  });

  describe('getClosedLauncherPosition', () => {
    it('anchors to iframe edges when embedded', () => {
      expect(getClosedLauncherPosition({
        urlReceive: 'https://example.com',
        bottomMarginPc: 10,
        rightMarginPc: 20,
      })).toEqual({
        bottom: '0px',
        right: '0px',
        left: 'auto',
      });
    });

    it('applies design margins in standalone preview', () => {
      expect(getClosedLauncherPosition({
        bottomMarginPc: 15,
        rightMarginPc: 25,
      })).toEqual({
        bottom: '15px',
        right: '25px',
        left: 'auto',
      });
    });

    it('uses standalone defaults when margins are zero', () => {
      expect(getClosedLauncherPosition({
        bottomMarginPc: 0,
        rightMarginPc: 0,
      })).toEqual({
        bottom: '10px',
        right: '0px',
        left: 'auto',
      });
    });

    it('omits bottom margin for embedded vertical tab launcher', () => {
      expect(getClosedLauncherPosition({
        urlReceive: 'https://example.com',
        bottomMarginPc: 10,
        widthPc: 400,
      }, { variant: 'vertical' })).toEqual({
        bottom: '200px',
        right: '-120px',
        left: 'auto',
      });
    });
  });

  describe('buildSdkPostMessageLayout', () => {
    it('includes launcher metadata for desktop', () => {
      expect(buildSdkPostMessageLayout({
        positionPc: '1',
        positionSp: '2',
        buttonTypePc: '2',
        buttonTypeSp: '1',
        useFullWidthChatbotMobile: false,
      }, false)).toEqual({
        positionPc: '1',
        positionSp: '2',
        buttonTypePc: '2',
        buttonTypeSp: '1',
        closedContentWidth: 56,
        closedContentHeight: 56,
      });
    });
  });
});
