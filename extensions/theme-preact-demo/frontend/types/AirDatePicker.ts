// Main AirDatepicker interface
export type AirDatepicker = {
  // Constructor options
  new (selector: string | HTMLElement, options?: AirDatepickerOptions): AirDatepicker;

  // Methods
  show(): void;
  hide(): void;
  toggle(): void;
  next(): void;
  prev(): void;
  selectDate(date: Date | Date[] | string | string[]): void;
  unselectDate(date: Date | string): void;
  clear(): void;
  setViewDate(date: Date | string): void;
  setFocusDate(date: Date | string | false): void;
  destroy(): void;
  update(newOptions: Partial<AirDatepickerOptions>): void;
};

// Options interface
export type AirDatepickerOptions = {
  classes?: string;
  inline?: boolean;
  locale?: AirDatepickerLocale;
  startDate?: Date | string;
  firstDay?: number;
  weekends?: number[];
  dateFormat?: string | ((date: Date) => string);
  altField?: string | HTMLElement;
  altFieldDateFormat?: string | ((date: Date) => string);
  toggleSelected?: boolean | ((params: { datepicker: AirDatepicker; date: Date }) => boolean);
  keyboardNav?: boolean;
  selectedDates?: (Date | string | number)[];
  container?: string | HTMLElement;
  isMobile?: boolean;
  visible?: boolean;
  position?: string | ((params: PositionParams) => void);
  view?: 'days' | 'months' | 'years';
  minView?: 'days' | 'months' | 'years';
  showOtherMonths?: boolean;
  selectOtherMonths?: boolean;
  moveToOtherMonthsOnSelect?: boolean;
  minDate?: Date | string;
  maxDate?: Date | string;
  disableNavWhenOutOfRange?: boolean;
  multipleDates?: boolean | number;
  range?: boolean;
  buttons?: string[] | ButtonConfiguration[];
  monthsField?: string;
  timepicker?: boolean;
  onlyTimepicker?: boolean;
  dateTimeSeparator?: string;
  timeFormat?: string;
  onSelect?: (params: OnSelectParams) => void;
  onChangeView?: (view: string) => void;
  onChangeMonth?: (month: number, year: number) => void;
  onChangeYear?: (year: number) => void;
  onChangeDecade?: (decade: number[]) => void;
  onRenderCell?: (params: CellParams) => CellOptions;
  onShow?: (isFinished: boolean) => void;
  onHide?: (isFinished: boolean) => void;
  autoClose?: boolean;
  element?: HTMLElement; // Added element property
};

// Locale interface
export type AirDatepickerLocale = {
  days: string[];
  daysShort: string[];
  daysMin: string[];
  months: string[];
  monthsShort: string[];
  today: string;
  clear: string;
  dateFormat: string;
  timeFormat: string;
  firstDay: number;
};

// Cell rendering parameters
export type CellParams = {
  date: Date;
  cellType: 'day' | 'month' | 'year';
  datepicker: AirDatepicker;
};

// Cell customization options
export type CellOptions = {
  html?: string;
  classes?: string;
  disabled?: boolean;
  attrs?: Record<string, string | number | undefined>;
};

// Position function parameters
export type PositionParams = {
  $datepicker: HTMLDivElement;
  $target: HTMLInputElement;
  $pointer: HTMLElement;
  isViewChange: boolean;
  done: () => void;
};

// Button configuration
export type ButtonConfiguration = {
  content: string | ((dp: AirDatepicker) => string);
  className?: string;
  tagName?: string;
  attrs?: Record<string, string | number | boolean | undefined>;
  onClick?: (dp: AirDatepicker) => void;
};

// onSelect callback parameters
export type OnSelectParams = {
  date: Date | Date[];
  formattedDate: string | string[];
  datepicker: AirDatepicker;
};
