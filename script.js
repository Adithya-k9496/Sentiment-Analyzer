document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const textInput = document.getElementById("text-input");
    const currentChar = document.getElementById("current-char");
    const btnAnalyze = document.getElementById("btn-analyze");
    const btnClear = document.getElementById("btn-clear");
    const themeToggle = document.getElementById("theme-toggle");
    
    // Sample buttons
    const btnSamplePos = document.getElementById("btn-sample-pos");
    const btnSampleNeg = document.getElementById("btn-sample-neg");
    const btnSampleNeutral = document.getElementById("btn-sample-neutral");

    // Stat Elements
    const statWords = document.getElementById("stat-words");
    const statChars = document.getElementById("stat-chars");
    const statSentences = document.getElementById("stat-sentences");
    const statReadtime = document.getElementById("stat-readtime");

    // Result Elements
    const resultScore = document.getElementById("result-score");
    const resultLabel = document.getElementById("result-label");
    const gaugeFillBar = document.getElementById("gauge-fill-bar");
    const highlightPreviewBox = document.getElementById("highlight-preview-box");

    // Emotion Bar Elements
    const fillJoy = document.getElementById("fill-joy");
    const fillSadness = document.getElementById("fill-sadness");
    const fillAnger = document.getElementById("fill-anger");
    const fillFear = document.getElementById("fill-fear");
    const pctJoy = document.getElementById("pct-joy");
    const pctSadness = document.getElementById("pct-sadness");
    const pctAnger = document.getElementById("pct-anger");
    const pctFear = document.getElementById("pct-fear");

    // History Elements
    const historyContainer = document.getElementById("history-container");
    const btnClearHistory = document.getElementById("btn-clear-history");

    // Sample Texts
    const samples = {
        positive: "This product is absolutely amazing! I am thrilled with the fast shipping and excellent service. The build quality is top-notch, and it works beautifully. It makes me so happy and joyful to use. Highly recommend to everyone!",
        negative: "Terrible experience. The product arrived broken and dirty. The customer service was worst and extremely useless when I asked for a refund. I am so disappointed, angry, and frustrated. Avoid this horrible brand at all costs!",
        neutral: "This package contains a user manual and a power adapter. The device operates at 220V and features three speed settings. Additional specifications are listed on the back cover of the product manual."
    };

    // ==========================================
    // Sentiment Dictionary (AFINN-based lexicon)
    // Values range from -5 to +5
    // ==========================================
    const sentimentLexicon = {
        // Positive words
        "amazing": 4, "awesome": 4, "beautiful": 3, "best": 5, "excellent": 4, "excited": 3, "glad": 2, "good": 2, "great": 3,
        "happy": 3, "love": 4, "perfect": 4, "recommend": 2, "superb": 4, "wonderful": 4, "thrilled": 4, "joyful": 4,
        "outstanding": 5, "fantastic": 4, "brilliant": 4, "cool": 2, "delighted": 3, "enjoy": 2, "friendly": 2, "helpful": 2,
        "impressive": 3, "nice": 2, "satisfied": 3, "useful": 2, "value": 2, "smart": 2, "pleased": 2, "worth": 2,
        "secure": 2, "fast": 2, "clean": 2, "top-notch": 4, "beautifully": 3, "success": 3, "creative": 2, "victory": 3,

        // Negative words
        "bad": -2, "terrible": -4, "worst": -5, "horrible": -4, "disappointed": -2, "angry": -3, "hate": -3, "broken": -2,
        "useless": -3, "worst": -4, "avoid": -2, "badly": -2, "boring": -2, "broken": -1, "cheap": -1, "crash": -2,
        "dirty": -2, "fail": -2, "frustrated": -3, "poor": -2, "sad": -2, "sorry": -1, "waste": -2, "worry": -3,
        "fear": -2, "afraid": -2, "scared": -2, "terrified": -4, "ugly": -3, "annoyed": -2, "hate": -4, "pain": -2,
        "ruined": -3, "slow": -2, "unhappy": -2, "wrong": -2, "fault": -2, "loss": -2, "threat": -3, "anxious": -2
    };

    // ==========================================
    // Emotion Dictionary (Emotion Mapping)
    // Lists keywords mapping to Joy, Sadness, Anger, Fear
    // ==========================================
    const emotionLexicon = {
        joy: ["amazing", "awesome", "beautiful", "best", "excellent", "excited", "glad", "good", "great", "happy", "love", "perfect", "thrilled", "joyful", "delighted", "enjoy", "satisfied", "success", "victory"],
        sadness: ["disappointed", "broken", "sad", "sorry", "unhappy", "loss", "pain", "ruined", "lonely", "depressed", "failure", "crying", "regret"],
        anger: ["angry", "hate", "frustrated", "annoyed", "mad", "furious", "irritated", "dislike", "offended", "rage", "bitter", "useless"],
        fear: ["fear", "afraid", "scared", "terrified", "worry", "anxious", "threat", "danger", "panic", "dread", "horror", "nervous"]
    };

    // ==========================================
    // Theme Management
    // ==========================================
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "☀️ Light Mode";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "☀️ Light Mode";
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "🌙 Dark Mode";
        }
    });

    // ==========================================
    // Text Input Counter & Autoupdate
    // ==========================================
    textInput.addEventListener("input", () => {
        const text = textInput.value;
        currentChar.textContent = text.length;
        updateTextStats(text);
        
        // Auto-analyze on input for true real-time feel if text changes
        if (text.trim().length > 0) {
            analyzeText(text, false); // analyze without saving to history during typing
        } else {
            resetResults();
        }
    });

    // ==========================================
    // Sample Load Handlers
    // ==========================================
    btnSamplePos.addEventListener("click", () => {
        textInput.value = samples.positive;
        textInput.dispatchEvent(new Event("input"));
        analyzeText(samples.positive, true);
    });

    btnSampleNeg.addEventListener("click", () => {
        textInput.value = samples.negative;
        textInput.dispatchEvent(new Event("input"));
        analyzeText(samples.negative, true);
    });

    btnSampleNeutral.addEventListener("click", () => {
        textInput.value = samples.neutral;
        textInput.dispatchEvent(new Event("input"));
        analyzeText(samples.neutral, true);
    });

    // ==========================================
    // Action Trigger Handlers
    // ==========================================
    btnAnalyze.addEventListener("click", () => {
        const text = textInput.value.trim();
        if (text.length === 0) {
            alert("Please enter some text to analyze!");
            return;
        }
        analyzeText(text, true); // analyze and commit to history
    });

    btnClear.addEventListener("click", () => {
        textInput.value = "";
        textInput.dispatchEvent(new Event("input"));
        resetResults();
    });

    btnClearHistory.addEventListener("click", () => {
        historyContainer.innerHTML = '<p class="placeholder-text">No items analyzed in this session yet.</p>';
    });

    // ==========================================
    // Core Sentiment Analysis Engine
    // ==========================================
    function analyzeText(text, saveToHistory = false) {
        if (!text || text.trim().length === 0) {
            resetResults();
            return;
        }

        // 1. Clean and Tokenize
        // Split text by non-alphanumeric characters while preserving words
        const tokens = text.toLowerCase().split(/[^a-zA-Z0-9'-]+/);
        
        let totalScore = 0;
        let matchedCount = 0;
        
        // 2. Calculate Sentiment Score
        tokens.forEach(token => {
            if (sentimentLexicon.hasOwnProperty(token)) {
                totalScore += sentimentLexicon[token];
                matchedCount++;
            }
        });

        // Calculate average score, default to 0 if no match
        let averageScore = matchedCount > 0 ? (totalScore / matchedCount) : 0;
        
        // Boost factor: scale the score slightly based on volume of matches, caps at -5 to +5
        if (matchedCount > 1) {
            averageScore = averageScore * (1 + (matchedCount * 0.05));
        }
        averageScore = Math.max(-5, Math.min(5, averageScore));

        // 3. Emotion Mapping Analysis
        const emotionCounts = { joy: 0, sadness: 0, anger: 0, fear: 0 };
        let emotionTokensCount = 0;

        tokens.forEach(token => {
            for (const emotion in emotionLexicon) {
                if (emotionLexicon[emotion].includes(token)) {
                    emotionCounts[emotion]++;
                    emotionTokensCount++;
                }
            }
        });

        // Convert emotion frequencies to percentages
        const emotionPcts = { joy: 0, sadness: 0, anger: 0, fear: 0 };
        if (emotionTokensCount > 0) {
            for (const emo in emotionCounts) {
                emotionPcts[emo] = Math.round((emotionCounts[emo] / emotionTokensCount) * 100);
            }
        } else {
            // Default sentiment-based fallbacks if no emotion keywords match
            if (averageScore > 1.5) {
                emotionPcts.joy = Math.round(averageScore * 18);
            } else if (averageScore < -1.5) {
                const absolute = Math.abs(averageScore);
                emotionPcts.sadness = Math.round(absolute * 12);
                emotionPcts.anger = Math.round(absolute * 12);
            }
        }

        // 4. Update the Dashboard UI
        updateDashboard(averageScore, emotionPcts);
        
        // 5. Generate Highlights
        generateWordHighlights(text);

        // 6. Push to history if requested
        if (saveToHistory) {
            addHistoryItem(text, averageScore);
        }
    }

    // ==========================================
    // UI Helpers
    // ==========================================
    function updateTextStats(text) {
        const charCount = text.length;
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        
        // Simple sentence count regex
        const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        
        // Average adult reads at 200 words per minute
        const readingTimeSec = Math.max(0, Math.round((wordCount / 200) * 60));

        statWords.textContent = wordCount;
        statChars.textContent = charCount;
        statSentences.textContent = sentenceCount;
        statReadtime.textContent = readingTimeSec + "s";
    }

    function updateDashboard(score, emotionPcts) {
        // Format score to 1 decimal place
        resultScore.textContent = (score > 0 ? "+" : "") + score.toFixed(1);
        
        // Determine label and colors
        let label = "Neutral";
        let strokeColor = "var(--color-neutral)";
        let scoreColor = "var(--color-neutral)";

        if (score >= 0.5) {
            label = "Positive";
            strokeColor = "var(--color-positive)";
            scoreColor = "var(--color-positive)";
        } else if (score <= -0.5) {
            label = "Negative";
            strokeColor = "var(--color-negative)";
            scoreColor = "var(--color-negative)";
        }

        // Scale label based on severity
        if (score > 2.5) label = "Strongly Positive";
        if (score < -2.5) label = "Strongly Negative";

        resultLabel.textContent = label;
        resultLabel.style.color = scoreColor;
        resultScore.style.color = scoreColor;

        // Gauge circular meter update
        // Scale score (-5 to +5) to percentage (0% to 100%)
        const pct = ((score + 5) / 10) * 100;
        const circumference = 2 * Math.PI * 40; // ~251.2
        const offset = circumference - (pct / 100) * circumference;
        
        gaugeFillBar.style.strokeDashoffset = offset;
        gaugeFillBar.style.stroke = strokeColor;

        // Update emotion bars
        fillJoy.style.width = emotionPcts.joy + "%";
        pctJoy.textContent = emotionPcts.joy + "%";

        fillSadness.style.width = emotionPcts.sadness + "%";
        pctSadness.textContent = emotionPcts.sadness + "%";

        fillAnger.style.width = emotionPcts.anger + "%";
        pctAnger.textContent = emotionPcts.anger + "%";

        fillFear.style.width = emotionPcts.fear + "%";
        pctFear.textContent = emotionPcts.fear + "%";
    }

    function generateWordHighlights(text) {
        if (!text || text.trim().length === 0) {
            highlightPreviewBox.innerHTML = '<span class="placeholder-text">Enter text in the left panel to see word highlights.</span>';
            return;
        }

        // Split text by words and non-words using regex groups to preserve formatting
        const tokens = text.split(/(\b[a-zA-Z0-9'-]+\b)/g);
        
        const highlightedHtml = tokens.map(token => {
            const lowerToken = token.toLowerCase();
            if (sentimentLexicon.hasOwnProperty(lowerToken)) {
                const score = sentimentLexicon[lowerToken];
                const highlightClass = score > 0 ? "word-pos" : "word-neg";
                return `<span class="highlighted-word ${highlightClass}">${token}</span>`;
            }
            // Escape HTML entities to prevent injection
            return token.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }).join("");

        highlightPreviewBox.innerHTML = highlightedHtml;
    }

    function addHistoryItem(text, score) {
        // Remove placeholder if present
        const placeholder = historyContainer.querySelector(".placeholder-text");
        if (placeholder) {
            historyContainer.innerHTML = "";
        }

        // Create item wrapper
        const item = document.createElement("div");
        item.className = "history-item";

        // Truncate text preview
        const textPreview = text.length > 80 ? text.substring(0, 80) + "..." : text;
        
        let badgeClass = "badge-neu";
        let scoreLabel = "Neutral";
        if (score >= 0.5) {
            badgeClass = "badge-pos";
            scoreLabel = "Positive";
        } else if (score <= -0.5) {
            badgeClass = "badge-neg";
            scoreLabel = "Negative";
        }

        item.innerHTML = `
            <span class="history-text" title="${text}">${textPreview}</span>
            <span class="history-score-badge ${badgeClass}">${(score > 0 ? "+" : "") + score.toFixed(1)} (${scoreLabel})</span>
        `;

        // Prepend to history container
        historyContainer.insertBefore(item, historyContainer.firstChild);

        // Limit history to top 5 items
        if (historyContainer.children.length > 5) {
            historyContainer.removeChild(historyContainer.lastChild);
        }
    }

    function resetResults() {
        resultScore.textContent = "0.0";
        resultLabel.textContent = "Neutral";
        resultLabel.style.color = "var(--text-secondary)";
        resultScore.style.color = "var(--text-primary)";
        
        // Set gauge to neutral (50%)
        const circumference = 2 * Math.PI * 40;
        gaugeFillBar.style.strokeDashoffset = circumference - 0.5 * circumference;
        gaugeFillBar.style.stroke = "var(--card-border)";

        // Reset emotion bars
        const resetEmos = { joy: 0, sadness: 0, anger: 0, fear: 0 };
        updateDashboard(0, resetEmos);

        highlightPreviewBox.innerHTML = '<span class="placeholder-text">Enter text in the left panel to see word highlights.</span>';
    }
});
