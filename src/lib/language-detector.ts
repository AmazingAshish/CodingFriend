
interface LanguagePattern {
  pattern: RegExp;
  weight: number;
  exclusive?: boolean; // If true, this pattern strongly indicates the language
}

interface LanguageDetectionResult {
  language: string;
  confidence: number;
  matches: string[];
  alternatives?: Array<{ language: string; confidence: number }>;
}

function detectLanguage(code: string): LanguageDetectionResult {
  if (!code || typeof code !== 'string') {
    return { language: 'Unknown', confidence: 0, matches: [] };
  }

  const patterns: Record<string, LanguagePattern[]> = {
    'Python': [
      { pattern: /def\s+\w+\s*\([^)]*\)\s*:/, weight: 3 },
      { pattern: /import\s+\w+/, weight: 2 },
      { pattern: /from\s+\w+\s+import/, weight: 3 },
      { pattern: /print\s*\(/, weight: 2 },
      { pattern: /if\s+__name__\s*==\s*['"']__main__['"']\s*:/, weight: 5, exclusive: true },
      { pattern: /:\s*$/, weight: 1 },
      { pattern: /elif\s+/, weight: 2 },
      { pattern: /^\s*#.*$/, weight: 1 },
      { pattern: /for\s+\w+\s+in\s+/, weight: 2 },
      { pattern: /except\s+\w*Error/, weight: 3 },
      { pattern: /with\s+open\s*\(/, weight: 3 },
      { pattern: /lambda\s+\w*:/, weight: 2 },
      { pattern: /\b(True|False|None)\b/, weight: 2 },
      { pattern: /f['"][^'"]*\{[^}]*\}/, weight: 2 }, // f-strings
      { pattern: /\bself\b/, weight: 2 },
      { pattern: /class\s+\w+\([^)]*\)\s*:/, weight: 3 }
    ],
    'JavaScript': [
      { pattern: /function\s+\w+\s*\(/, weight: 3 },
      { pattern: /const\s+\w+\s*=/, weight: 2 },
      { pattern: /let\s+\w+\s*=/, weight: 2 },
      { pattern: /var\s+\w+\s*=/, weight: 2 },
      { pattern: /console\.log\s*\(/, weight: 3 },
      { pattern: /=>\s*[{(]/, weight: 2 },
      { pattern: /document\./, weight: 3 },
      { pattern: /window\./, weight: 2 },
      { pattern: /\$\(/, weight: 2 }, // jQuery
      { pattern: /require\s*\(/, weight: 2 },
      { pattern: /module\.exports/, weight: 3 },
      { pattern: /\.then\s*\(/, weight: 2 },
      { pattern: /async\s+function/, weight: 2 },
      { pattern: /await\s+/, weight: 2 },
      { pattern: /\b(null|undefined)\b/, weight: 1 },
      { pattern: /JSON\.(parse|stringify)/, weight: 2 },
      { pattern: /addEventListener\s*\(/, weight: 2 }
    ],
    'TypeScript': [
      { pattern: /interface\s+\w+/, weight: 4, exclusive: true },
      { pattern: /type\s+\w+\s*=/, weight: 3 },
      { pattern: /:\s*(string|number|boolean|any|void|object)/, weight: 2 },
      { pattern: /function\s+\w+\s*\([^)]*:\s*\w+/, weight: 3 },
      { pattern: /export\s+interface/, weight: 4, exclusive: true },
      { pattern: /import.*from.*['"'].+['"']/, weight: 2 },
      { pattern: /<\w+>/, weight: 2 }, // Generics
      { pattern: /as\s+\w+/, weight: 2 },
      { pattern: /enum\s+\w+/, weight: 3 },
      { pattern: /public\s+\w+\s*\(/, weight: 2 },
      { pattern: /private\s+\w+/, weight: 2 },
      { pattern: /readonly\s+\w+/, weight: 2 },
      { pattern: /\?\s*:/, weight: 1 }, // Optional properties
      { pattern: /declare\s+/, weight: 3 }
    ],
    'Java': [
      { pattern: /public\s+class\s+\w+/, weight: 4, exclusive: true },
      { pattern: /public\s+static\s+void\s+main/, weight: 5, exclusive: true },
      { pattern: /System\.out\.print/, weight: 4, exclusive: true },
      { pattern: /import\s+java\./, weight: 3 },
      { pattern: /private\s+\w+\s+\w+/, weight: 2 },
      { pattern: /public\s+\w+\s+\w+\s*\(/, weight: 2 },
      { pattern: /extends\s+\w+/, weight: 2 },
      { pattern: /implements\s+\w+/, weight: 2 },
      { pattern: /@Override/, weight: 2 },
      { pattern: /new\s+\w+\s*\(/, weight: 1 },
      { pattern: /throws\s+\w+/, weight: 2 },
      { pattern: /package\s+[\w.]+;/, weight: 3 },
      { pattern: /ArrayList|HashMap|LinkedList/, weight: 2 }
    ],
    'C++': [
      { pattern: /#include\s*<[^>]+>/, weight: 3 },
      { pattern: /std::/, weight: 3 },
      { pattern: /cout\s*<</, weight: 3 },
      { pattern: /cin\s*>>/, weight: 3 },
      { pattern: /int\s+main\s*\(/, weight: 3 },
      { pattern: /using\s+namespace\s+std/, weight: 4, exclusive: true },
      { pattern: /class\s+\w+/, weight: 2 },
      { pattern: /template\s*</, weight: 3 },
      { pattern: /vector<\w+>/, weight: 2 },
      { pattern: /public\s*:/, weight: 2 },
      { pattern: /private\s*:/, weight: 2 },
      { pattern: /virtual\s+/, weight: 2 },
      { pattern: /const\s+\w+&/, weight: 2 },
      { pattern: /::/, weight: 1 }
    ],
    'C#': [
      { pattern: /using\s+System/, weight: 4, exclusive: true },
      { pattern: /public\s+class\s+\w+/, weight: 3 },
      { pattern: /Console\.Write/, weight: 4, exclusive: true },
      { pattern: /static\s+void\s+Main/, weight: 4, exclusive: true },
      { pattern: /namespace\s+\w+/, weight: 3 },
      { pattern: /public\s+static\s+/, weight: 2 },
      { pattern: /private\s+static\s+/, weight: 2 },
      { pattern: /\[.*\]/, weight: 2 }, // Attributes
      { pattern: /var\s+\w+\s*=/, weight: 1 },
      { pattern: /string\[\]/, weight: 2 },
      { pattern: /List<\w+>/, weight: 2 },
      { pattern: /get\s*;\s*set\s*;/, weight: 2 },
      { pattern: /override\s+/, weight: 2 }
    ],
    'C': [
      { pattern: /#include\s*<[^>]+\.h>/, weight: 3 },
      { pattern: /int\s+main\s*\(/, weight: 3 },
      { pattern: /printf\s*\(/, weight: 3 },
      { pattern: /scanf\s*\(/, weight: 3 },
      { pattern: /malloc\s*\(/, weight: 3 },
      { pattern: /free\s*\(/, weight: 3 },
      { pattern: /struct\s+\w+/, weight: 2 },
      { pattern: /typedef\s+/, weight: 2 },
      { pattern: /\*\w+/, weight: 1 }, // Pointers
      { pattern: /sizeof\s*\(/, weight: 2 },
      { pattern: /NULL/, weight: 1 },
      { pattern: /return\s+0\s*;/, weight: 1 }
    ],
    'Go': [
      { pattern: /package\s+\w+/, weight: 4, exclusive: true },
      { pattern: /func\s+\w+\s*\(/, weight: 3 },
      { pattern: /import\s*\(/, weight: 3 },
      { pattern: /fmt\.Print/, weight: 3 },
      { pattern: /var\s+\w+\s+\w+/, weight: 2 },
      { pattern: /go\s+\w+/, weight: 3 },
      { pattern: /defer\s+/, weight: 3 },
      { pattern: /chan\s+/, weight: 3 },
      { pattern: /make\s*\(/, weight: 2 },
      { pattern: /range\s+/, weight: 2 },
      { pattern: /goroutine/, weight: 2 },
      { pattern: /:=/, weight: 2 }
    ],
    'Rust': [
      { pattern: /fn\s+\w+\s*\(/, weight: 3 },
      { pattern: /let\s+mut\s+\w+/, weight: 3 },
      { pattern: /println!\s*\(/, weight: 4, exclusive: true },
      { pattern: /use\s+std::/, weight: 3 },
      { pattern: /struct\s+\w+/, weight: 2 },
      { pattern: /impl\s+/, weight: 3 },
      { pattern: /match\s+/, weight: 3 },
      { pattern: /&str/, weight: 2 },
      { pattern: /Vec<\w+>/, weight: 2 },
      { pattern: /Option<\w+>/, weight: 2 },
      { pattern: /Result<\w+,\s*\w+>/, weight: 2 },
      { pattern: /\|.*\|/, weight: 1 }, // Closures
      { pattern: /pub\s+fn/, weight: 2 }
    ],
    'PHP': [
      { pattern: /<\?php/, weight: 5, exclusive: true },
      { pattern: /echo\s+/, weight: 3 },
      { pattern: /\$\w+/, weight: 3 },
      { pattern: /function\s+\w+\s*\(/, weight: 2 },
      { pattern: /class\s+\w+/, weight: 2 },
      { pattern: /require\s+/, weight: 2 },
      { pattern: /include\s+/, weight: 2 },
      { pattern: /->/, weight: 2 },
      { pattern: /\$this->/, weight: 2 },
      { pattern: /array\s*\(/, weight: 2 },
      { pattern: /\?>/,  weight: 2 },
      { pattern: /isset\s*\(/, weight: 2 }
    ],
    'Ruby': [
      { pattern: /def\s+\w+/, weight: 3 },
      { pattern: /puts\s+/, weight: 3 },
      { pattern: /class\s+\w+/, weight: 2 },
      { pattern: /require\s+/, weight: 2 },
      { pattern: /end\s*$/, weight: 2 },
      { pattern: /@\w+/, weight: 2 },
      { pattern: /\.each\s+do/, weight: 3 },
      { pattern: /elsif\s+/, weight: 2 },
      { pattern: /\|\w+\|/, weight: 2 }, // Block parameters
      { pattern: /attr_accessor/, weight: 2 },
      { pattern: /module\s+\w+/, weight: 2 },
      { pattern: /\#{.*}/, weight: 2 } // String interpolation
    ],
    'Swift': [
      { pattern: /func\s+\w+\s*\(/, weight: 3 },
      { pattern: /var\s+\w+\s*:/, weight: 2 },
      { pattern: /let\s+\w+\s*:/, weight: 2 },
      { pattern: /print\s*\(/, weight: 2 },
      { pattern: /import\s+\w+/, weight: 2 },
      { pattern: /class\s+\w+\s*:/, weight: 2 },
      { pattern: /struct\s+\w+/, weight: 2 },
      { pattern: /extension\s+/, weight: 2 },
      { pattern: /protocol\s+\w+/, weight: 2 },
      { pattern: /override\s+func/, weight: 2 },
      { pattern: /\?\?/, weight: 1 }, // Nil coalescing
      { pattern: /guard\s+/, weight: 2 }
    ],
    'Kotlin': [
      { pattern: /fun\s+\w+\s*\(/, weight: 3 },
      { pattern: /val\s+\w+/, weight: 2 },
      { pattern: /var\s+\w+/, weight: 2 },
      { pattern: /println\s*\(/, weight: 3 },
      { pattern: /class\s+\w+/, weight: 2 },
      { pattern: /object\s+\w+/, weight: 2 },
      { pattern: /when\s*\(/, weight: 3 },
      { pattern: /data\s+class/, weight: 3 },
      { pattern: /companion\s+object/, weight: 3 },
      { pattern: /\.let\s*\{/, weight: 2 },
      { pattern: /\?\s*:/, weight: 1 }, // Elvis operator
      { pattern: /lateinit\s+var/, weight: 2 }
    ],
    'Scala': [
      { pattern: /def\s+\w+\s*\(/, weight: 3 },
      { pattern: /val\s+\w+/, weight: 2 },
      { pattern: /var\s+\w+/, weight: 2 },
      { pattern: /object\s+\w+/, weight: 3 },
      { pattern: /class\s+\w+/, weight: 2 },
      { pattern: /trait\s+\w+/, weight: 3 },
      { pattern: /case\s+class/, weight: 3 },
      { pattern: /import\s+scala\./, weight: 3 },
      { pattern: /println\s*\(/, weight: 2 },
      { pattern: /=>\s*/, weight: 2 },
      { pattern: /\s*<-\s*/, weight: 2 } // For comprehensions
    ],
    'R': [
      { pattern: /<-/, weight: 4, exclusive: true },
      { pattern: /library\s*\(/, weight: 3 },
      { pattern: /data\.frame\s*\(/, weight: 3 },
      { pattern: /c\s*\(/, weight: 2 },
      { pattern: /function\s*\(/, weight: 2 },
      { pattern: /print\s*\(/, weight: 1 },
      { pattern: /\$\w+/, weight: 2 },
      { pattern: /install\.packages/, weight: 3 },
      { pattern: /str\s*\(/, weight: 2 },
      { pattern: /summary\s*\(/, weight: 2 }
    ],
    'MATLAB': [
      { pattern: /function\s+\w+\s*=/, weight: 3 },
      { pattern: /end\s*$/, weight: 1 },
      { pattern: /fprintf\s*\(/, weight: 3 },
      { pattern: /plot\s*\(/, weight: 3 },
      { pattern: /zeros\s*\(/, weight: 2 },
      { pattern: /ones\s*\(/, weight: 2 },
      { pattern: /size\s*\(/, weight: 2 },
      { pattern: /length\s*\(/, weight: 2 },
      { pattern: /%.*$/, weight: 1 }, // Comments
      { pattern: /\[.*\]/, weight: 1 } // Arrays
    ],
    'Perl': [
      { pattern: /#!\/usr\/bin\/perl/, weight: 5, exclusive: true },
      { pattern: /use\s+strict/, weight: 3 },
      { pattern: /use\s+warnings/, weight: 3 },
      { pattern: /\$\w+/, weight: 2 },
      { pattern: /@\w+/, weight: 2 },
      { pattern: /%\w+/, weight: 2 },
      { pattern: /print\s+/, weight: 2 },
      { pattern: /my\s+\$/, weight: 2 },
      { pattern: /=~/, weight: 2 },
      { pattern: /chomp\s*\(/, weight: 2 }
    ],
    'Shell': [
      { pattern: /#!\/bin\/(ba)?sh/, weight: 5, exclusive: true },
      { pattern: /echo\s+/, weight: 2 },
      { pattern: /\$\w+/, weight: 2 },
      { pattern: /if\s*\[/, weight: 2 },
      { pattern: /for\s+\w+\s+in/, weight: 2 },
      { pattern: /while\s*\[/, weight: 2 },
      { pattern: /grep\s+/, weight: 2 },
      { pattern: /sed\s+/, weight: 2 },
      { pattern: /awk\s+/, weight: 2 },
      { pattern: /chmod\s+/, weight: 2 },
      { pattern: /\|\s*\w+/, weight: 1 } // Pipes
    ],
    'PowerShell': [
      { pattern: /Get-\w+/, weight: 3 },
      { pattern: /Set-\w+/, weight: 3 },
      { pattern: /New-\w+/, weight: 3 },
      { pattern: /\$\w+/, weight: 2 },
      { pattern: /Write-Host/, weight: 3 },
      { pattern: /param\s*\(/, weight: 3 },
      { pattern: /\[Parameter\]/, weight: 3 },
      { pattern: /\-\w+/, weight: 2 }, // Parameters
      { pattern: /\|\s*\w+/, weight: 1 } // Pipes
    ],
    'Lua': [
      { pattern: /function\s+\w+\s*\(/, weight: 3 },
      { pattern: /local\s+\w+/, weight: 2 },
      { pattern: /end\s*$/, weight: 2 },
      { pattern: /print\s*\(/, weight: 2 },
      { pattern: /require\s*\(/, weight: 2 },
      { pattern: /then\s*$/, weight: 2 },
      { pattern: /elseif\s+/, weight: 2 },
      { pattern: /\.\.\s*/, weight: 2 }, // String concatenation
      { pattern: /ipairs\s*\(/, weight: 2 },
      { pattern: /pairs\s*\(/, weight: 2 }
    ],
    'Haskell': [
      { pattern: /\w+\s*::\s*/, weight: 3 },
      { pattern: /import\s+\w+/, weight: 2 },
      { pattern: /data\s+\w+/, weight: 3 },
      { pattern: /where\s*$/, weight: 2 },
      { pattern: /\|\s*\w+/, weight: 2 },
      { pattern: /let\s+\w+/, weight: 2 },
      { pattern: /case\s+\w+\s+of/, weight: 3 },
      { pattern: /->\s*/, weight: 2 },
      { pattern: /\$\s*/, weight: 2 },
      { pattern: /\w+\s*<-/, weight: 2 }
    ],
    'Dart': [
      { pattern: /void\s+main\s*\(/, weight: 3 },
      { pattern: /print\s*\(/, weight: 2 },
      { pattern: /var\s+\w+\s*=/, weight: 2 },
      { pattern: /String\s+\w+/, weight: 2 },
      { pattern: /int\s+\w+/, weight: 2 },
      { pattern: /double\s+\w+/, weight: 2 },
      { pattern: /bool\s+\w+/, weight: 2 },
      { pattern: /List<\w+>/, weight: 2 },
      { pattern: /Map<\w+,\s*\w+>/, weight: 2 },
      { pattern: /class\s+\w+/, weight: 2 },
      { pattern: /extends\s+\w+/, weight: 2 },
      { pattern: /import\s+['"]dart:/, weight: 3 }
    ],
    'Elixir': [
      { pattern: /defmodule\s+\w+/, weight: 4, exclusive: true },
      { pattern: /def\s+\w+/, weight: 3 },
      { pattern: /defp\s+\w+/, weight: 3 },
      { pattern: /IO\.puts/, weight: 3 },
      { pattern: /\|>/, weight: 3 },
      { pattern: /case\s+\w+\s+do/, weight: 3 },
      { pattern: /when\s+/, weight: 2 },
      { pattern: /%\w+\{/, weight: 2 }, // Structs
      { pattern: /GenServer/, weight: 2 },
      { pattern: /receive\s+do/, weight: 2 }
    ],
    'Clojure': [
      { pattern: /\(defn\s+\w+/, weight: 4, exclusive: true },
      { pattern: /\(def\s+\w+/, weight: 3 },
      { pattern: /\(ns\s+\w+/, weight: 3 },
      { pattern: /\(println/, weight: 3 },
      { pattern: /\(let\s*\[/, weight: 3 },
      { pattern: /\(if\s+/, weight: 2 },
      { pattern: /\(map\s+/, weight: 2 },
      { pattern: /\(filter\s+/, weight: 2 },
      { pattern: /\(reduce\s+/, weight: 2 },
      { pattern: /\[\s*\w+\s*\]/, weight: 2 } // Vector destructuring
    ],
    'Objective-C': [
      { pattern: /@interface\s+\w+/, weight: 4, exclusive: true },
      { pattern: /@implementation\s+\w+/, weight: 4, exclusive: true },
      { pattern: /@property/, weight: 3 },
      { pattern: /@synthesize/, weight: 3 },
      { pattern: /NSString\s*\*/, weight: 3 },
      { pattern: /NSLog\s*\(/, weight: 3 },
      { pattern: /\[\w+\s+\w+\]/, weight: 3 },
      { pattern: /#import\s+</, weight: 3 },
      { pattern: /\*\)\s*\w+/, weight: 2 },
      { pattern: /@end/, weight: 2 }
    ],
    'F#': [
      { pattern: /let\s+\w+\s*=/, weight: 3 },
      { pattern: /let\s+rec\s+\w+/, weight: 3 },
      { pattern: /printfn/, weight: 3 },
      { pattern: /match\s+\w+\s+with/, weight: 3 },
      { pattern: /\|\s*\w+/, weight: 2 },
      { pattern: /open\s+\w+/, weight: 2 },
      { pattern: /module\s+\w+/, weight: 2 },
      { pattern: /type\s+\w+/, weight: 2 },
      { pattern: /->/, weight: 2 },
      { pattern: /\|>/, weight: 2 }
    ],
    'VB.NET': [
      { pattern: /Module\s+\w+/, weight: 3 },
      { pattern: /Sub\s+Main\s*\(/, weight: 4, exclusive: true },
      { pattern: /Console\.WriteLine/, weight: 4, exclusive: true },
      { pattern: /Dim\s+\w+\s+As/, weight: 3 },
      { pattern: /Public\s+Class/, weight: 3 },
      { pattern: /End\s+Sub/, weight: 2 },
      { pattern: /End\s+Function/, weight: 2 },
      { pattern: /End\s+Class/, weight: 2 },
      { pattern: /Imports\s+System/, weight: 3 },
      { pattern: /If\s+.*\s+Then/, weight: 2 }
    ],
    'SQL': [
      { pattern: /SELECT\s+.*\s+FROM/, weight: 4, exclusive: true },
      { pattern: /INSERT\s+INTO/, weight: 3 },
      { pattern: /UPDATE\s+.*\s+SET/, weight: 3 },
      { pattern: /DELETE\s+FROM/, weight: 3 },
      { pattern: /CREATE\s+TABLE/, weight: 3 },
      { pattern: /ALTER\s+TABLE/, weight: 3 },
      { pattern: /DROP\s+TABLE/, weight: 3 },
      { pattern: /WHERE\s+/, weight: 2 },
      { pattern: /GROUP\s+BY/, weight: 2 },
      { pattern: /ORDER\s+BY/, weight: 2 },
      { pattern: /INNER\s+JOIN/, weight: 2 },
      { pattern: /LEFT\s+JOIN/, weight: 2 }
    ],
    'HTML': [
      { pattern: /<!DOCTYPE\s+html>/i, weight: 5, exclusive: true },
      { pattern: /<html[^>]*>/i, weight: 4 },
      { pattern: /<head[^>]*>/i, weight: 3 },
      { pattern: /<body[^>]*>/i, weight: 3 },
      { pattern: /<div[^>]*>/i, weight: 2 },
      { pattern: /<span[^>]*>/i, weight: 2 },
      { pattern: /<p[^>]*>/i, weight: 2 },
      { pattern: /<a\s+href/i, weight: 2 },
      { pattern: /<img\s+src/i, weight: 2 },
      { pattern: /<script[^>]*>/i, weight: 2 },
      { pattern: /<style[^>]*>/i, weight: 2 },
      { pattern: /<meta[^>]*>/i, weight: 2 }
    ],
    'CSS': [
      { pattern: /\w+\s*\{[^}]*\}/, weight: 3 },
      { pattern: /\.\w+\s*\{/, weight: 3 },
      { pattern: /#\w+\s*\{/, weight: 3 },
      { pattern: /:\s*\w+\s*;/, weight: 2 },
      { pattern: /@media\s+/, weight: 3 },
      { pattern: /@import\s+/, weight: 3 },
      { pattern: /font-family\s*:/, weight: 2 },
      { pattern: /background-color\s*:/, weight: 2 },
      { pattern: /display\s*:\s*flex/, weight: 2 },
      { pattern: /margin\s*:/, weight: 2 },
      { pattern: /padding\s*:/, weight: 2 },
      { pattern: /border\s*:/, weight: 2 }
    ],
    'JSON': [
      { pattern: /^\s*\{/, weight: 3 },
      { pattern: /^\s*\[/, weight: 3 },
      { pattern: /"\w+"\s*:/, weight: 3 },
      { pattern: /:\s*"[^"]*"/, weight: 2 },
      { pattern: /:\s*\d+/, weight: 2 },
      { pattern: /:\s*(true|false|null)/, weight: 2 },
      { pattern: /,\s*$/, weight: 2 }
    ],
    'XML': [
      { pattern: /<\?xml\s+version/, weight: 5, exclusive: true },
      { pattern: /<\w+[^>]*>/, weight: 3 },
      { pattern: /<\/\w+>/, weight: 3 },
      { pattern: /<\w+[^>]*\/>/, weight: 3 },
      { pattern: /xmlns\s*=/, weight: 2 },
      { pattern: /<!--.*-->/, weight: 2 }
    ],
    'YAML': [
      { pattern: /^\s*\w+\s*:/, weight: 3 },
      { pattern: /^\s*-\s+/, weight: 3 },
      { pattern: /---\s*$/, weight: 3 },
      { pattern: /\|\s*$/, weight: 2 },
      { pattern: />\s*$/, weight: 2 },
      { pattern: /!!\w+/, weight: 2 }
    ]
  };

  const scores: Record<string, number> = {};
  const matches: Record<string, string[]> = {};
  
  // Clean the code for better pattern matching
  const cleanCode = code.trim();
  
  // Calculate scores for each language
  for (const [language, languagePatterns] of Object.entries(patterns)) {
    scores[language] = 0;
    matches[language] = [];
    
    for (const { pattern, weight, exclusive } of languagePatterns) {
      const match = cleanCode.match(pattern);
      if (match) {
        scores[language] += weight;
        matches[language].push(match[0]);
        
        // Exclusive patterns provide strong evidence
        if (exclusive) {
          scores[language] += weight * 2;
        }
      }
    }
  }
  
  // Apply additional heuristics
  applyAdditionalHeuristics(cleanCode, scores);
  
  // Find the language with the highest score
  const sortedLanguages = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort(([, a], [, b]) => b - a);
  
  if (sortedLanguages.length === 0) {
    return { language: 'Unknown', confidence: 0, matches: [] };
  }
  
  const [topLanguage, topScore] = sortedLanguages[0];
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const confidence = Math.min(100, Math.round((topScore / Math.max(totalScore, 1)) * 100));
  
  // Get alternatives (top 3 other candidates)
  const alternatives = sortedLanguages
    .slice(1, 4)
    .map(([lang, score]) => ({
      language: lang,
      confidence: Math.min(100, Math.round((score / Math.max(totalScore, 1)) * 100))
    }))
    .filter(alt => alt.confidence > 5);
  
  return {
    language: topLanguage,
    confidence,
    matches: matches[topLanguage] || [],
    alternatives: alternatives.length > 0 ? alternatives : undefined
  };
}

function applyAdditionalHeuristics(code: string, scores: Record<string, number>): void {
  // File extension patterns (if present in comments)
  const extensionPatterns = {
    '.py': 'Python',
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.java': 'Java',
    '.cpp': 'C++',
    '.c': 'C',
    '.cs': 'C#',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.go': 'Go',
    '.rs': 'Rust',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.scala': 'Scala',
    '.r': 'R',
    '.m': 'MATLAB',
    '.pl': 'Perl',
    '.sh': 'Shell',
    '.ps1': 'PowerShell',
    '.lua': 'Lua',
    '.hs': 'Haskell',
    '.dart': 'Dart',
    '.ex': 'Elixir',
    '.clj': 'Clojure',
    '.fs': 'F#',
    '.vb': 'VB.NET',
    '.sql': 'SQL',
    '.html': 'HTML',
    '.css': 'CSS',
    '.json': 'JSON',
    '.xml': 'XML',
    '.yml': 'YAML',
    '.yaml': 'YAML'
  };
  
  for (const [ext, lang] of Object.entries(extensionPatterns)) {
    if (code.includes(ext) && scores[lang] !== undefined) {
      scores[lang] += 2;
    }
  }
  
  // Indentation patterns
  const hasTabIndentation = /^\t/m.test(code);
  const hasSpaceIndentation = /^[ ]{2,}/m.test(code);
  
  if (hasTabIndentation) {
    // Languages that commonly use tabs
    ['C', 'C++', 'Go', 'MATLAB'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 1;
    });
  }
  
  if (hasSpaceIndentation) {
    // Languages that commonly use spaces
    ['Python', 'JavaScript', 'TypeScript', 'Ruby', 'YAML'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 1;
    });
  }
  
  // Semicolon patterns
  const hasSemicolons = /;[\s]*$/m.test(code);
  if (hasSemicolons) {
    ['JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'C#', 'PHP', 'Scala'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 1;
    });
  }
  
  // Bracket style patterns
  const hasNewlineBrackets = /\n\s*\{/m.test(code);
  const hasSameLineBrackets = /\)\s*\{/m.test(code);
  
  if (hasNewlineBrackets) {
    ['C', 'C++', 'C#'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 1;
    });
  }
  
  if (hasSameLineBrackets) {
    ['JavaScript', 'TypeScript', 'Java', 'Go'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 1;
    });
  }
  
  // Comment style patterns
  const hasHashComments = /^\s*#/m.test(code);
  const hasDoubleSlashComments = /\/\//m.test(code);
  const hasSlashStarComments = /\/\*[\s\S]*?\*\//m.test(code);
  
  if (hasHashComments) {
    ['Python', 'Ruby', 'Shell', 'Perl', 'R'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 1;
    });
  }
  
  if (hasDoubleSlashComments) {
    ['JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 'Dart'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 1;
    });
  }
  
  if (hasSlashStarComments) {
    ['JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 'CSS'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 1;
    });
  }
  
  // String literal patterns
  const hasTripleQuotes = /"""|'''/m.test(code);
  const hasBackticks = /`[^`]*`/m.test(code);
  const hasRawStrings = /r["'][^"']*["']/m.test(code);
  
  if (hasTripleQuotes) {
    ['Python'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 2;
    });
  }
  
  if (hasBackticks) {
    ['JavaScript', 'TypeScript', 'Shell'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 1;
    });
  }
  
  if (hasRawStrings) {
    ['Python'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 2;
    });
  }
  
  // Markup/data format specific patterns
  const isLikelyMarkup = /<[^>]+>/m.test(code) && !/<\w+\s*=/.test(code);
  const isLikelyData = /^\s*[\{\[]/.test(code) && /[\}\]]\s*$/.test(code);
  
  if (isLikelyMarkup) {
    ['HTML', 'XML'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 2;
    });
  }
  
  if (isLikelyData) {
    ['JSON', 'YAML'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 1;
    });
  }
  
  // Functional programming patterns
  const hasFunctionalPatterns = /\b(map|filter|reduce|fold|lambda|=&gt;|\|&gt;)\b/m.test(code);
  if (hasFunctionalPatterns) {
    ['JavaScript', 'TypeScript', 'Python', 'Scala', 'Haskell', 'F#', 'Clojure', 'Elixir'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 1;
    });
  }
  
  // Object-oriented patterns
  const hasOOPatterns = /\b(class|extends|implements|inheritance|polymorphism|encapsulation)\b/m.test(code);
  if (hasOOPatterns) {
    ['Java', 'C++', 'C#', 'Python', 'JavaScript', 'TypeScript', 'Ruby', 'Swift', 'Kotlin', 'Scala'].forEach(lang => {
      if (scores[lang] !== undefined) scores[lang] += 1;
    });
  }
}

// Enhanced usage examples
function demonstrateLanguageDetection(): void {
  const examples = [
    {
      name: "Python with f-strings",
      code: `
def greet(name, age):
    return f"Hello {name}, you are {age} years old!"

if __name__ == "__main__":
    print(greet("Alice", 30))
`
    },
    {
      name: "Modern JavaScript",
      code: `
const fetchUserData = async (userId) => {
    try {
        const response = await fetch(\`/api/users/\${userId}\`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};
`
    },
    {
      name: "TypeScript with interfaces",
      code: `
interface User {
    id: number;
    name: string;
    email?: string;
}

function createUser(userData: Partial<User>): User {
    return {
        id: Math.random(),
        name: 'Anonymous',
        ...userData
    };
}
`
    },
    {
      name: "Rust with pattern matching",
      code: `
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    
    let result: Result<i32, &str> = Ok(42);
    
    match result {
        Ok(value) => println!("Success: {}", value),
        Err(error) => println!("Error: {}", error),
    }
}
`
    }
  ];
  
  examples.forEach(example => {
    const result = detectLanguage(example.code);
    console.log(`${example.name}:`, result);
  });
}

// Export for use
export { detectLanguage, demonstrateLanguageDetection };
export type { LanguageDetectionResult, LanguagePattern };
