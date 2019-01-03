// @flow
import type { PluginType } from "webiny-plugins/types";
import authenticate from "./authentication/authenticate";
import { getPlugins } from "webiny-plugins";
import { shield } from "graphql-shield";

export default ([
    {
        type: "graphql-middleware",
        name: "graphql-middleware-shield",
        middleware: () => {
            const middleware = [];
            getPlugins("graphql").forEach(plugin => {
                const { security } = plugin;
                if (!security) {
                    return true;
                }

                security.shield && middleware.push(shield(security.shield));
            });

            return middleware;
        }
    },
    { type: "security", name: "security", authenticate }
]: Array<PluginType>);
