/**
 * GDPR Cookie Consent Manager
 * Fully compliant with EU GDPR regulations
 * 
 * CRITICAL: This MUST be loaded BEFORE any other scripts (especially Google Analytics)
 */

class CookieConsentManager {
    constructor(config = {}) {
        this.config = {
            cookieName: 'cookie_consent',
            cookieExpiry: 365, // days
            version: '1.0', // Change this to force re-consent
            onConsentChange: config.onConsentChange || null,
            categories: {
                essential: {
                    name: 'Essential',
                    description: 'Required for the website to function properly. Cannot be disabled.',
                    required: true,
                    enabled: true
                },
                analytics: {
                    name: 'Analytics',
                    description: 'Help us understand how visitors interact with our website.',
                    required: false,
                    enabled: false,
                    scripts: config.analyticsScripts || []
                }
            }
        };
        
        this.consent = this.loadConsent();
        this.init();
    }

    init() {
        // If no consent exists or version changed, show banner
        if (!this.consent || this.consent.version !== this.config.version) {
            this.showBanner();
        } else {
            // Apply saved preferences
            this.applyConsent();
        }

        // Add settings trigger listener
        this.attachSettingsTriggers();
    }

    loadConsent() {
        try {
            const cookie = document.cookie
                .split('; ')
                .find(row => row.startsWith(this.config.cookieName + '='));
            
            if (cookie) {
                return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
            }
        } catch (e) {
            console.error('Error loading consent:', e);
        }
        return null;
    }

    saveConsent(preferences) {
        const consent = {
            version: this.config.version,
            timestamp: new Date().toISOString(),
            preferences: preferences
        };

        const expires = new Date();
        expires.setDate(expires.getDate() + this.config.cookieExpiry);

        document.cookie = `${this.config.cookieName}=${encodeURIComponent(JSON.stringify(consent))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        
        this.consent = consent;
        return consent;
    }

    applyConsent() {
        const prefs = this.consent.preferences;

        // Load analytics scripts if consented
        if (prefs.analytics && this.config.categories.analytics.scripts.length > 0) {
            this.loadAnalyticsScripts();
        }

        // Trigger callback if provided
        if (this.config.onConsentChange) {
            this.config.onConsentChange(prefs);
        }
    }

    loadAnalyticsScripts() {
        const scripts = this.config.categories.analytics.scripts;
        
        scripts.forEach(scriptConfig => {
            if (scriptConfig.type === 'gtag') {
                // Google Analytics 4
                this.loadGoogleAnalytics(scriptConfig.id);
            } else if (scriptConfig.type === 'custom') {
                // Custom script URL
                this.loadCustomScript(scriptConfig.src);
            }
        });
    }

    loadGoogleAnalytics(measurementId) {
        // Load gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', measurementId, {
            'anonymize_ip': true, // GDPR requirement
            'cookie_flags': 'SameSite=None;Secure'
        });
    }

    loadCustomScript(src) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
    }

    acceptAll() {
        const preferences = {
            essential: true,
            analytics: true
        };
        
        this.saveConsent(preferences);
        this.applyConsent();
        this.hideBanner();
    }

    acceptSelected(preferences) {
        preferences.essential = true; // Always enabled
        this.saveConsent(preferences);
        this.applyConsent();
        this.hideSettings();
        this.hideBanner();
    }

    rejectNonEssential() {
        const preferences = {
            essential: true,
            analytics: false
        };
        
        this.saveConsent(preferences);
        this.hideBanner();
    }

    showBanner() {
        // Remove existing banner if any
        this.hideBanner();

        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <h3>🍪 Cookie Settings</h3>
                    <p>We use cookies to enhance your browsing experience and analyze our traffic. 
                    You can choose which cookies to accept below. 
                    Read our <a href="privacy.html" style="color: #4F46E5; text-decoration: underline;">Privacy Policy</a> for more details.</p>
                </div>
                <div class="cookie-consent-buttons">
                    <button class="cookie-btn cookie-btn-settings" onclick="cookieConsent.showSettings()">
                        ⚙️ Customize
                    </button>
                    <button class="cookie-btn cookie-btn-reject" onclick="cookieConsent.rejectNonEssential()">
                        Reject All
                    </button>
                    <button class="cookie-btn cookie-btn-accept" onclick="cookieConsent.acceptAll()">
                        Accept All
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);
        
        // Trigger animation
        setTimeout(() => banner.classList.add('show'), 10);
    }

    hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 300);
        }
    }

    showSettings() {
        // Remove existing settings panel if any
        this.hideSettings();

        const currentPrefs = this.consent?.preferences || {
            essential: true,
            analytics: false
        };

        const panel = document.createElement('div');
        panel.id = 'cookie-settings-panel';
        panel.className = 'cookie-settings-panel';
        panel.innerHTML = `
            <div class="cookie-settings-overlay" onclick="cookieConsent.hideSettings()"></div>
            <div class="cookie-settings-content">
                <div class="cookie-settings-header">
                    <h2>Cookie Preferences</h2>
                    <button class="cookie-settings-close" onclick="cookieConsent.hideSettings()">✕</button>
                </div>
                
                <div class="cookie-settings-body">
                    <p class="cookie-settings-intro">
                        We use cookies to improve your experience on our website. 
                        You can customize your preferences below.
                    </p>

                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <div>
                                <h3>${this.config.categories.essential.name}</h3>
                                <p>${this.config.categories.essential.description}</p>
                            </div>
                            <label class="cookie-toggle">
                                <input type="checkbox" checked disabled>
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="cookie-category-info">
                            <span class="cookie-badge cookie-badge-required">Always Active</span>
                        </div>
                    </div>

                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <div>
                                <h3>${this.config.categories.analytics.name}</h3>
                                <p>${this.config.categories.analytics.description}</p>
                            </div>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="analytics-toggle" ${currentPrefs.analytics ? 'checked' : ''}>
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="cookie-settings-footer">
                    <a href="privacy.html" style="color: #4F46E5; text-decoration: none; font-size: 14px; margin-right: auto;">
                        📄 Privacy Policy
                    </a>
                    <button class="cookie-btn cookie-btn-secondary" onclick="cookieConsent.hideSettings()">
                        Cancel
                    </button>
                    <button class="cookie-btn cookie-btn-primary" onclick="cookieConsent.saveFromSettings()">
                        Save Preferences
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        setTimeout(() => panel.classList.add('show'), 10);
    }

    hideSettings() {
        const panel = document.getElementById('cookie-settings-panel');
        if (panel) {
            panel.classList.remove('show');
            setTimeout(() => panel.remove(), 300);
        }
    }

    saveFromSettings() {
        const analyticsToggle = document.getElementById('analytics-toggle');
        
        const preferences = {
            essential: true,
            analytics: analyticsToggle ? analyticsToggle.checked : false
        };

        this.acceptSelected(preferences);
    }

    attachSettingsTriggers() {
        // Listen for clicks on elements with data-cookie-settings attribute
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-cookie-settings]') || 
                e.target.closest('[data-cookie-settings]')) {
                e.preventDefault();
                this.showSettings();
            }
        });
    }

    // Public method to get current consent status
    hasConsent(category) {
        if (!this.consent) return false;
        return this.consent.preferences[category] === true;
    }

    // Public method to revoke consent and delete all non-essential cookies
    revokeConsent() {
        // Delete the consent cookie
        document.cookie = `${this.config.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        
        // Delete analytics cookies if they exist
        this.deleteAnalyticsCookies();
        
        // Reset consent
        this.consent = null;
        
        // Show banner again
        this.showBanner();
    }

    deleteAnalyticsCookies() {
        // Common Google Analytics cookies
        const gaCookies = ['_ga', '_gid', '_gat', '_gat_gtag'];
        
        gaCookies.forEach(cookieName => {
            // Delete for current domain
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            // Delete for parent domain
            const domain = window.location.hostname.split('.').slice(-2).join('.');
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
        });
    }
}

// Make globally available
window.CookieConsentManager = CookieConsentManager;