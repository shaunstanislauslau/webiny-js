// @flow
import { Model } from "webiny-model";
import { settingsFactory } from "webiny-api/entities";

class ColorsModel extends Model {
    constructor() {
        super();
        this.attr("background").char();
        this.attr("text").char();
    }
}

class PaletteModel extends Model {
    constructor() {
        super();
        this.attr("popup").model(ColorsModel);
        this.attr("button").model(ColorsModel);
    }
}

class CookiePolicySettingsModel extends Model {
    constructor() {
        super();
        this.attr("enabled").boolean();
        this.attr("position")
            .char()
            .setValidators("in:bottom:top:bottom-left:bottom-right")
            .setDefaultValue("bottom");
        this.attr("palette").model(PaletteModel);
    }
}

export default [
    {
        name: "schema-settings-cookie-policy",
        type: "schema-settings",
        namespace: "cookiePolicy",
        typeDefs: /* GraphQL */ `
            type CookiePolicySettings {
                enabled: Boolean
                position: String
                palette: CookiePolicySettingsPalette
            }

            type CookiePolicySettingsPaletteColors {
                background: String
                text: String
            }

            type CookiePolicySettingsPalette {
                popup: CookiePolicySettingsPaletteColors
                button: CookiePolicySettingsPaletteColors
            }

            input CookiePolicySettingsInput {
                enabled: Boolean
                position: String
                palette: CookiePolicySettingsPaletteInput
            }

            input CookiePolicySettingsPaletteColorsInput {
                background: String
                text: String
            }

            input CookiePolicySettingsPaletteInput {
                popup: CookiePolicySettingsPaletteColorsInput
                button: CookiePolicySettingsPaletteColorsInput
            }

            extend type SettingsQuery {
                cookiePolicy: CookiePolicySettings
            }

            extend type SettingsMutation {
                cookiePolicy(data: CookiePolicySettingsInput): CookiePolicySettings
            }
        `,
        entity: ({
            cookiePolicy: {
                entities: { CookiePolicySettings }
            }
        }: Object) => CookiePolicySettings
    },
    {
        type: "entity",
        name: "entity-cookie-policy-settings",
        namespace: "cookiePolicy",
        entity: {
            name: "CookiePolicySettings",
            factory: (...args: Array<any>) => {
                return class CookiePolicySettings extends settingsFactory(...args) {
                    static key = "cookie-policy";

                    data: Object;
                    load: Function;

                    constructor() {
                        super();
                        this.attr("data").model(CookiePolicySettingsModel);
                    }
                };
            }
        }
    }
];