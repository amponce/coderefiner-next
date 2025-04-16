import { FrameworkType } from './types'

const basePatterns = {
  LARGE_FUNCTION: /function\s+([A-Za-z0-9_$]+)\s*\(([^)]*)\)/g,
  ARROW_FUNCTION: /const\s+([A-Za-z0-9_$]+)\s*=\s*(\([^)]*\)|[A-Za-z0-9_$]+)\s*=>/g,
  NESTED_LOOPS: /for\s*\([^{]*\)\s*{[^}]*for\s*\([^{]*\)/g,
  EXPENSIVE_ARRAY_METHODS: /\.(map|filter|reduce|forEach|some|every|find|findIndex)\(/g,
  INLINE_OBJECT_CREATION: /<[A-Za-z0-9]+[^>]*\{[\s\n]*\{[^}]*\}[\s\n]*\}/g,
}

const reactPatterns = {
  ...basePatterns,
  CLASS_COMPONENT: /class\s+\w+\s+extends\s+(React\.)?Component/g,
  INLINE_FUNCTION: /{[\s\n]*\([^)]*\)[\s\n]*=>[\s\n]*{/g,
  EXPENSIVE_STATE_UPDATE: /setState\(\{\s*.*,.*,.*,.*,/g,
  RENDER_METHOD: /render\(\)\s*{/g,
  USE_EFFECT_EMPTY_DEPS: /useEffect\(\(\)\s*=>\s*{[^}]*},\s*\[\]\)/g,
  USE_MEMO_DEPS: /useMemo\(\(\)\s*=>\s*{[^}]*},\s*\[[^\]]+\]\)/g,
  CONTEXT_CONSUMER: /<\s*([A-Za-z0-9_$]+)\.Consumer\s*>/g,
}

const vuePatterns = {
  ...basePatterns,
  OPTIONS_API: /export\s+default\s*\{[\s\n]*name:/g,
  WATCH_HANDLER: /watch\s*:\s*\{[^}]*\}/g,
  COMPUTED_PROPERTY: /computed\s*:\s*\{[^}]*\}/g,
  V_FOR_KEY: /v-for\s*=\s*["'][^"']*["']\s*:key\s*=/g,
  TEMPLATE_REF: /ref\s*=\s*["'][^"']*["']/g,
}

const angularPatterns = {
  ...basePatterns,
  DECORATOR: /@(Component|Injectable|Directive|Pipe)\s*\(\s*\{/g,
  LIFECYCLE_HOOKS: /ng(OnInit|OnDestroy|OnChanges|DoCheck|AfterViewInit)\s*\(\s*\)/g,
  TEMPLATE_BINDING: /\[\([^)]*\)\]/g,
  DEPENDENCY_INJECTION: /constructor\s*\([^)]*\)\s*{/g,
  ASYNC_PIPE: /\|\s*async/g,
}

const nextPatterns = {
  ...reactPatterns,
  GET_SERVER_SIDE_PROPS: /export\s+(?:const|async\s+function)?\s*getServerSideProps/g,
  GET_STATIC_PROPS: /export\s+(?:const|async\s+function)?\s*getStaticProps/g,
  API_ROUTE: /export\s+default\s+(?:async\s+)?function\s+handler/g,
  CLIENT_COMPONENT: /"use client"/g,
  SERVER_COMPONENT: /"use server"/g,
}

export const getPatterns = (framework: FrameworkType) => {
  switch (framework) {
    case 'react':
      return reactPatterns
    case 'vue':
      return vuePatterns
    case 'angular':
      return angularPatterns
    case 'next':
      return nextPatterns
    default:
      return basePatterns
  }
}

export const THRESHOLDS = {
  LINE_THRESHOLD: 100, // Functions with more than this many lines are flagged
  MAX_FUNCTION_PARAMS: 4, // Flag functions with more parameters than this
  MAX_ARRAY_OPERATIONS: 5, // Flag when more than this many array operations in a file
  MAX_STATE_UPDATES: 3, // Flag when more than this many simultaneous state updates
} 