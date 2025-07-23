/**
 * Utility Types and Helper Types
 * Reusable type utilities for common patterns
 */

// Basic Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

// Deep utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Array and Object utilities
export type NonEmptyArray<T> = [T, ...T[]];
export type ArrayElement<T> = T extends (infer U)[] ? U : never;
export type ObjectValues<T> = T[keyof T];
export type ObjectKeys<T> = keyof T;

// Function utilities
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P
  : never;

export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R
  ? R
  : any;

// Discriminated Union utilities
export type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = T extends Record<K, V>
  ? T
  : never;

export type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T> = {
  [V in T[K]]: DiscriminateUnion<T, K, V>;
};

// Form and Validation Types
export interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
}

export type FormFields<T> = {
  [K in keyof T]: FormField<T[K]>;
};

export type FormValues<T> = {
  [K in keyof T]: T[K] extends FormField<infer U> ? U : never;
};

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export interface FormState<T> {
  fields: FormFields<T>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  submitCount: number;
  errors: FormErrors<T>;
}

// Validation Types
export type ValidationRule<T> = (value: T) => string | undefined;
export type ValidationRules<T> = ValidationRule<T>[];

export interface ValidationSchema<T> {
  [K in keyof T]?: ValidationRules<T[K]>;
}

export type ValidationResult<T> = {
  isValid: boolean;
  errors: FormErrors<T>;
};

// API State Types
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncState<T, E = Error> {
  data: T | null;
  loading: boolean;
  error: E | null;
  lastFetch?: Date;
}

export interface PaginatedState<T> extends AsyncState<T[]> {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// Resource State Types
export type ResourceState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

export type MutationState<T, V = any> =
  | { status: 'idle' }
  | { status: 'loading'; variables?: V }
  | { status: 'success'; data: T; variables: V }
  | { status: 'error'; error: Error; variables?: V };

// Event Types
export interface CustomEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
  source?: string;
}

export type EventHandler<T = any> = (event: CustomEvent<T>) => void;
export type EventMap = Record<string, any>;

// Component Prop Types
export type ComponentProps<T extends React.ComponentType<any>> = T extends React.ComponentType<
  infer P
>
  ? P
  : never;

export type PropsWithChildren<P = {}> = P & { children?: React.ReactNode };
export type PropsWithClassName<P = {}> = P & { className?: string };
export type PropsWithTestId<P = {}> = P & { 'data-testid'?: string };

// Style and Theme Types
export type CSSProperties = React.CSSProperties;
export type StyleVariant = string | number | boolean;
export type StyleVariants = Record<string, StyleVariant>;

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface ThemeBreakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  wide: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  breakpoints: ThemeBreakpoints;
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, number>;
  };
  shadows: Record<string, string>;
  borderRadius: Record<string, string>;
  zIndex: Record<string, number>;
}

// Route and Navigation Types
export interface RouteParams {
  [key: string]: string | undefined;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
  permissions?: string[];
  external?: boolean;
}

// Permission and Role Types
export type Permission = string;
export type Role = string;

export interface PermissionCheck {
  permissions: Permission[];
  operator?: 'AND' | 'OR';
}

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
}

// Search and Filter Types
export interface SearchOptions {
  query: string;
  filters: Record<string, any>;
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    pageSize: number;
  };
}

export interface FilterOption<T = any> {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'range' | 'date' | 'boolean';
  options?: Array<{ value: T; label: string }>;
  defaultValue?: T;
}

export interface SortOption {
  field: string;
  label: string;
  direction?: 'asc' | 'desc';
}

// Media and File Types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface MediaMetadata {
  filename: string;
  size: number;
  type: string;
  dimensions?: ImageDimensions;
  duration?: number; // for video/audio
  alt?: string;
  caption?: string;
}

// Analytics and Tracking Types
export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp?: Date;
  userId?: string;
  sessionId?: string;
}

export interface PageViewEvent extends AnalyticsEvent {
  name: 'page_view';
  properties: {
    page: string;
    title: string;
    referrer?: string;
    path: string;
  };
}

export interface ClickEvent extends AnalyticsEvent {
  name: 'click';
  properties: {
    element: string;
    text?: string;
    url?: string;
    position?: { x: number; y: number };
  };
}

// Configuration Types
export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  features: Record<string, boolean>;
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  stripe: {
    publishableKey: string;
  };
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

// Error Types
export interface AppError extends Error {
  code: string;
  statusCode?: number;
  context?: Record<string, any>;
  timestamp: Date;
}

export interface ValidationError extends AppError {
  field: string;
  value: any;
  constraint: string;
}

export interface NetworkError extends AppError {
  url: string;
  method: string;
  statusCode: number;
  response?: any;
}

// Type Guards
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isNumber = (value: unknown): value is number => typeof value === 'number';
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
export const isObject = (value: unknown): value is object => 
  typeof value === 'object' && value !== null && !Array.isArray(value);
export const isArray = <T>(value: unknown): value is T[] => Array.isArray(value);
export const isFunction = (value: unknown): value is Function => typeof value === 'function';
export const isDefined = <T>(value: T | undefined | null): value is T => 
  value !== undefined && value !== null;
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// Utility Functions for Types
export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${value}`);
};

export const exhaustiveCheck = (value: never): never => {
  throw new Error(`Exhaustive check failed: ${value}`);
};

// Generic Utility Types for React Components
export type ComponentWithAs<P, T extends React.ElementType> = P & {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof P>;

export type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

export type PolymorphicComponentProps<T extends React.ElementType, P = {}> = ComponentWithAs<
  P,
  T
> & {
  ref?: PolymorphicRef<T>;
};

// Conditional Types
export type If<C extends boolean, T, F> = C extends true ? T : F;
export type Not<C extends boolean> = C extends true ? false : true;
export type And<A extends boolean, B extends boolean> = A extends true
  ? B extends true
    ? true
    : false
  : false;
export type Or<A extends boolean, B extends boolean> = A extends true
  ? true
  : B extends true
  ? true
  : false;

// Brand Types (for type safety)
export type Brand<T, B> = T & { __brand: B };
export type UserId = Brand<string, 'UserId'>;
export type Email = Brand<string, 'Email'>;
export type URL = Brand<string, 'URL'>;
export type Timestamp = Brand<string, 'Timestamp'>;

// Opaque Types
export type Opaque<T, K> = T & { readonly __opaque: K };
export type JWT = Opaque<string, 'JWT'>;
export type Base64 = Opaque<string, 'Base64'>;
export type HexColor = Opaque<string, 'HexColor'>;

// Template Literal Types
export type CSSUnit = `${number}${'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'}`;
export type EventName<T extends string> = `on${Capitalize<T>}`;
export type DataAttribute<T extends string> = `data-${T}`;
export type AriaAttribute<T extends string> = `aria-${T}`;

// Mapped Types
export type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

export type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

export type EventHandlers<T> = {
  [K in keyof T as EventName<string & K>]: (value: T[K]) => void;
};

// Recursive Types
export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export interface JSONObject {
  [key: string]: JSONValue;
}
export interface JSONArray extends Array<JSONValue> {}

// Tree Structure Types
export interface TreeNode<T = any> {
  id: string;
  data: T;
  children?: TreeNode<T>[];
  parent?: TreeNode<T>;
}

export type FlattenTree<T> = T extends TreeNode<infer U> ? U : never;

// State Machine Types
export type StateValue = string | Record<string, StateValue>;
export type StateTransition<T extends StateValue> = {
  from: T;
  to: T;
  event: string;
  guard?: () => boolean;
  action?: () => void;
};

export interface StateMachine<T extends StateValue> {
  initial: T;
  states: Record<string, any>;
  transitions: StateTransition<T>[];
}

// Builder Pattern Types
export interface Builder<T> {
  build(): T;
}

export type FluentBuilder<T, K extends keyof T> = {
  [P in K]: (value: T[P]) => FluentBuilder<T, Exclude<K, P>>;
} & (K extends never ? { build(): T } : {});

// Nominal Types for Domain Modeling
export interface Nominal<T, N> {
  readonly __nominal: N;
  readonly value: T;
}

export type ProductId = Nominal<string, 'ProductId'>;
export type OrderId = Nominal<string, 'OrderId'>;
export type CustomerId = Nominal<string, 'CustomerId'>;
export type Price = Nominal<number, 'Price'>;
export type Quantity = Nominal<number, 'Quantity'>;

// Result Type for Error Handling
export type Result<T, E = Error> = Success<T> | Failure<E>;
export interface Success<T> {
  success: true;
  data: T;
}
export interface Failure<E> {
  success: false;
  error: E;
}

// Option Type for Null Safety
export type Option<T> = Some<T> | None;
export interface Some<T> {
  isSome: true;
  isNone: false;
  value: T;
}
export interface None {
  isSome: false;
  isNone: true;
}

// Helper functions for Result and Option types
export const success = <T>(data: T): Success<T> => ({ success: true, data });
export const failure = <E>(error: E): Failure<E> => ({ success: false, error });
export const some = <T>(value: T): Some<T> => ({ isSome: true, isNone: false, value });
export const none: None = { isSome: false, isNone: true };

export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> => result.success;
export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> => !result.success;
export const isSome = <T>(option: Option<T>): option is Some<T> => option.isSome;
export const isNone = <T>(option: Option<T>): option is None => option.isNone;