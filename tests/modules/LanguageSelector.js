(function() {
    $(document).ready(function() {
        QUnit.module("LanguageSelector");

        QUnit.test("generateOptions", function(assert) {
            var languageSelector = $("<div id='jsLanguageSelectorPopout'><div id='jsLanguageMenuTitle'></div></div>");
            $("body").append(languageSelector);

            LanguageSelector.generateOptions({
                "en": "English",
                "es": "Espa&ntilde;ol",
                "sv": "Swedish"
            });

            assert.equal(4, languageSelector.children().length);
            assert.equal(3, $(".jsSelectedLanguage").length);

            assert.equal("en", $(languageSelector.children()[1]).data("language"));
            assert.equal("English", $(languageSelector.children()[1]).children(".timeline__settings-text").text());

            assert.equal("es", $(languageSelector.children()[2]).data("language"));
            assert.equal("Español", $(languageSelector.children()[2]).children(".timeline__settings-text").text());

            assert.equal("sv", $(languageSelector.children()[3]).data("language"));
            assert.equal("Swedish", $(languageSelector.children()[3]).children(".timeline__settings-text").text());

            languageSelector.remove();
        });

        QUnit.test("getStartingLanguage - param", function(assert) {
            var originalSetting = LanguageSelector.settings.defaultLanguage;
            LanguageSelector.settings.defaultLanguage = "sv";

            sinon.stub(LanguageSelector, "getLanguageFromParam").returns("en");
            sinon.stub(LanguageSelector, "getLanguageFromLocale").returns("es");

            assert.equal("en", LanguageSelector.getStartingLanguage());

            LanguageSelector.getLanguageFromParam.restore();
            LanguageSelector.getLanguageFromLocale.restore();
            LanguageSelector.settings.defaultLanguage = originalSetting;
        });

        QUnit.test("getStartingLanguage - locale", function(assert) {
            var originalSetting = LanguageSelector.settings.defaultLanguage;
            LanguageSelector.settings.defaultLanguage = "sv";

            sinon.stub(LanguageSelector, "getLanguageFromParam").returns(false);
            sinon.stub(LanguageSelector, "getLanguageFromLocale").returns("es");

            assert.equal("es", LanguageSelector.getStartingLanguage());

            LanguageSelector.getLanguageFromParam.restore();
            LanguageSelector.getLanguageFromLocale.restore();
            LanguageSelector.settings.defaultLanguage = originalSetting;
        });

        QUnit.test("getStartingLanguage - setting", function(assert) {
            var originalSetting = LanguageSelector.settings.defaultLanguage;
            LanguageSelector.settings.defaultLanguage = "sv";

            sinon.stub(LanguageSelector, "getLanguageFromParam").returns(false);
            sinon.stub(LanguageSelector, "getLanguageFromLocale").returns(false);

            assert.equal("sv", LanguageSelector.getStartingLanguage());

            LanguageSelector.getLanguageFromParam.restore();
            LanguageSelector.getLanguageFromLocale.restore();
            LanguageSelector.settings.defaultLanguage = originalSetting;
        });

        QUnit.test("getLanguageFromParam", function(assert) {
            var originalSettings = LanguageSelector.settings.languages;
            LanguageSelector.settings.languages = {
                "en": "English",
                "es": "Spanish"
            };

            assert.notOk(LanguageSelector.getLanguageFromParam(window), "no param");

            // Explicity pass a mock version of window through, as this cannot be overriden/mocked in the normal way
            var language = "",
                mockWindow = {
                    location: {
                        search: {
                            search: function() {
                                return 1;
                            },
                            match: function() {
                                return ["language=" + language];
                            }
                        }
                    }
                };

            language = "en";
            assert.equal("en", LanguageSelector.getLanguageFromParam(mockWindow), "en param - supported language");

            language = "es";
            assert.equal("es", LanguageSelector.getLanguageFromParam(mockWindow), "es param - supported language");

            language = "ja";
            assert.equal(false, LanguageSelector.getLanguageFromParam(mockWindow), "ja param - unsupported language");

            LanguageSelector.settings.languages = originalSettings;
        });

        QUnit.test("getLanguageFromLocale", function(assert) {
            var originalSettings = LanguageSelector.settings.languages;
            LanguageSelector.settings.languages = {
                "en": "English",
                "es": "Spanish"
            };

            assert.equal(false, LanguageSelector.getLanguageFromLocale([]), "no locales");

            assert.equal("en", LanguageSelector.getLanguageFromLocale(["en"]), "en single locale");
            assert.equal("en", LanguageSelector.getLanguageFromLocale(["en-US"]), "en-US single locale");
            assert.equal("en", LanguageSelector.getLanguageFromLocale(["en-US", "en"]), "en-US and en locales");
            assert.equal("en", LanguageSelector.getLanguageFromLocale(["en", "en-US"]), "en-US and en locales");

            assert.equal("en", LanguageSelector.getLanguageFromLocale(["en-US", "es"]), "en-US and es locales");
            assert.equal("es", LanguageSelector.getLanguageFromLocale(["es", "en-US"]), "es and en-US locales");

            assert.equal("en", LanguageSelector.getLanguageFromLocale(["ja", "sv", "en-US", "es"]), "ja, sv, en and es locales - ja/sv unsupported");
            assert.equal("es", LanguageSelector.getLanguageFromLocale(["sv", "ja", "pl", "es"]), "sv, ja, pl and es locales - sv/ja/pl unsupported");
            assert.equal(false, LanguageSelector.getLanguageFromLocale(["sv", "ja", "pl", "fr"]), "sv, ja, pl and fr locales - all supported");

            LanguageSelector.settings.languages = originalSettings;
        });
    });
})();
