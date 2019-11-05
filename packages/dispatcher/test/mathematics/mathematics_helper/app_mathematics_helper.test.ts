/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { exampleFunctionMathematicsHelper } from "../../../src/mathematics/mathematics_helper/app_mathematics_helper";
import { exampleFunctionMathematicsHelperSoftmax } from "../../../src/mathematics/mathematics_helper/app_mathematics_helper";

import { Utility } from "../../../src/utility/utility";

describe("Test Suite - mathematics/mathematics_helper/app_mathematics_helper", () => {
    it("Test.0000 exampleFunctionMathematicsHelper", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        exampleFunctionMathematicsHelper();
    });
    it("Test.0001 exampleFunctionMathematicsHelperSoftmax", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        exampleFunctionMathematicsHelperSoftmax();
    });
});
