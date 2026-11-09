import {
  PROCESS_BAR_LABEL_TYPE_HTML,
  PROCESS_BAR_LABEL_TYPE_TEXT,
  isProgressBarComplete,
  resolveProgressBarCompletedHtml,
  resolveProgressBarLabel,
} from './processBarLabel';
import { PROCESS_BAR_COMPLETE_TEXT } from './Constants';

describe('isProgressBarComplete', () => {
  it('returns true when current reaches max', () => {
    expect(isProgressBarComplete(7, 7)).toBe(true);
    expect(isProgressBarComplete(8, 7)).toBe(true);
  });

  it('returns false when incomplete or max is zero', () => {
    expect(isProgressBarComplete(2, 7)).toBe(false);
    expect(isProgressBarComplete(0, 0)).toBe(false);
  });
});

describe('resolveProgressBarCompletedHtml', () => {
  it('reads camel and snake keys and trims', () => {
    expect(resolveProgressBarCompletedHtml({
      progressBarCompletedHtml: '  <b>Done</b>  ',
    })).toBe('<b>Done</b>');
    expect(resolveProgressBarCompletedHtml({
      progress_bar_completed_html: '<span>完了</span>',
    })).toBe('<span>完了</span>');
  });

  it('returns empty string when missing', () => {
    expect(resolveProgressBarCompletedHtml(null)).toBe('');
    expect(resolveProgressBarCompletedHtml({})).toBe('');
  });
});

describe('resolveProgressBarLabel', () => {
  it('returns HTML when complete and completedHtml is set', () => {
    expect(resolveProgressBarLabel({
      current: 7,
      maxIndex: 7,
      isFractionMode: true,
      completedHtml: '<b>Done!</b>',
    })).toEqual({
      type: PROCESS_BAR_LABEL_TYPE_HTML,
      value: '<b>Done!</b>',
    });
  });

  it('keeps fraction max/max when complete without HTML', () => {
    expect(resolveProgressBarLabel({
      current: 7,
      maxIndex: 7,
      isFractionMode: true,
      completedHtml: '',
    })).toEqual({
      type: PROCESS_BAR_LABEL_TYPE_TEXT,
      value: '7/7',
    });
  });

  it('uses complete text for remaining mode without HTML', () => {
    expect(resolveProgressBarLabel({
      current: 7,
      maxIndex: 7,
      isFractionMode: false,
      completedHtml: '',
    })).toEqual({
      type: PROCESS_BAR_LABEL_TYPE_TEXT,
      value: PROCESS_BAR_COMPLETE_TEXT,
    });
  });

  it('formats in-progress remaining and fraction labels', () => {
    expect(resolveProgressBarLabel({
      current: 2,
      maxIndex: 7,
      isFractionMode: false,
      completedHtml: '',
    })).toEqual({
      type: PROCESS_BAR_LABEL_TYPE_TEXT,
      value: 'あと5問',
    });
    expect(resolveProgressBarLabel({
      current: 2,
      maxIndex: 7,
      isFractionMode: true,
      completedHtml: '<b>Done</b>',
    })).toEqual({
      type: PROCESS_BAR_LABEL_TYPE_TEXT,
      value: '2/7',
    });
  });
});
