/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import assert = require("assert");

import { CrossValidator } from "../../../../src/model/evaluation/cross_validation/cross_validator";

import { AppSoftmaxRegressionSparse } from "../../../../src/model/supervised/classifier/neural_network/learner/app_softmax_regression_sparse";

import { ColumnarContentEmail } from "../../../data/columnar_data.test";
import { LuContentEmail } from "../../../data/lu_data.test";

import { ConfusionMatrix } from "../../../../src/model/evaluation/confusion_matrix/confusion_matrix";

import { ColumnarData } from "../../../../src/data/columnar_data";

import { LuData } from "../../../../src/data/lu_data";

import { NgramSubwordFeaturizer } from "../../../../src/model/language_understanding/featurizer/ngram_subword_featurizer";

import { Utility } from "../../../../src/utility/utility";

describe("Test Suite - model/evaluation/cross_validator/CrossValidator", async () => {
    it("Test.0000 crossValidate()", async function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const luContent: string = LuContentEmail;
        const numberOfCrossValidationFolds: number =
            CrossValidator.defaultNumberOfCrossValidationFolds;
        const learnerParameterEpochs: number =
            AppSoftmaxRegressionSparse.defaultEpochs;
        const learnerParameterMiniBatchSize: number =
            AppSoftmaxRegressionSparse.defaultMiniBatchSize;
        const learnerParameterL1Regularization: number =
            AppSoftmaxRegressionSparse.defaultL1Regularization;
        const learnerParameterL2Regularization: number =
            AppSoftmaxRegressionSparse.defaultL2Regularization;
        const learnerParameterLossEarlyStopRatio: number =
            AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio;
        const learnerParameterLearningRate: number =
            AppSoftmaxRegressionSparse.defaultLearningRate;
        const learnerParameterToCalculateOverallLossAfterEpoch: boolean =
            true;
        const luData: LuData =
            await LuData.createLuData(
                luContent,
                new NgramSubwordFeaturizer());
        const intentLabelIndexArray: number[] =
            luData.getIntentLabelIndexArray();
        const utteranceFeatureIndexArrays: number[][] =
            luData.getUtteranceFeatureIndexArrays();
        assert(intentLabelIndexArray, "intentLabelIndexArray is undefined.");
        assert(utteranceFeatureIndexArrays, "utteranceFeatureIndexArrays is undefined.");
        const crossValidator: CrossValidator =
            new CrossValidator(
                numberOfCrossValidationFolds,
                learnerParameterEpochs,
                learnerParameterMiniBatchSize,
                learnerParameterL1Regularization,
                learnerParameterL2Regularization,
                learnerParameterLossEarlyStopRatio,
                learnerParameterLearningRate,
                learnerParameterToCalculateOverallLossAfterEpoch);
        const confusionMatrixCrossValidation: ConfusionMatrix =
            crossValidator.crossValidate(
                luData.getFeaturizerLabels(),
                luData.getFeaturizerLabelMap(),
                luData.getFeaturizer().getNumberLabels(),
                luData.getFeaturizer().getNumberFeatures(),
                intentLabelIndexArray,
                utteranceFeatureIndexArrays,
                luData.getIntentInstanceIndexMapArray());
        Utility.debuggingLog(
            `, confusionMatrixCrossValidation=` +
            `${confusionMatrixCrossValidation.getMicroAverageMetrics()}` +
            `, confusionMatrixCrossValidation=` +
            `${confusionMatrixCrossValidation.getMicroAverageMetrics()}`);
    });
    it("Test.0001 crossValidate()", function() {
        Utility.toPrintDebuggingLogToConsole = true;
        this.timeout(Utility.getDefaultUnitTestTimeout());
        const luContent: string = ColumnarContentEmail;
        const labelColumnIndex: number = 0;
        const textColumnIndex: number = 2;
        const linesToSkip: number = 1;
        const numberOfCrossValidationFolds: number =
            CrossValidator.defaultNumberOfCrossValidationFolds;
        const learnerParameterEpochs: number =
            AppSoftmaxRegressionSparse.defaultEpochs;
        const learnerParameterMiniBatchSize: number =
            AppSoftmaxRegressionSparse.defaultMiniBatchSize;
        const learnerParameterL1Regularization: number =
            AppSoftmaxRegressionSparse.defaultL1Regularization;
        const learnerParameterL2Regularization: number =
            AppSoftmaxRegressionSparse.defaultL2Regularization;
        const learnerParameterLossEarlyStopRatio: number =
            AppSoftmaxRegressionSparse.defaultLossEarlyStopRatio;
        const learnerParameterLearningRate: number =
            AppSoftmaxRegressionSparse.defaultLearningRate;
        const learnerParameterToCalculateOverallLossAfterEpoch: boolean =
            true;
        const columnarData: ColumnarData =
            ColumnarData.createColumnarData(
                luContent,
                new NgramSubwordFeaturizer(),
                labelColumnIndex,
                textColumnIndex,
                linesToSkip);
        const intentLabelIndexArray: number[] =
            columnarData.getIntentLabelIndexArray();
        const utteranceFeatureIndexArrays: number[][] =
            columnarData.getUtteranceFeatureIndexArrays();
        assert(intentLabelIndexArray, "intentLabelIndexArray is undefined.");
        assert(utteranceFeatureIndexArrays, "utteranceFeatureIndexArrays is undefined.");
        const crossValidator: CrossValidator =
            new CrossValidator(
                numberOfCrossValidationFolds,
                learnerParameterEpochs,
                learnerParameterMiniBatchSize,
                learnerParameterL1Regularization,
                learnerParameterL2Regularization,
                learnerParameterLossEarlyStopRatio,
                learnerParameterLearningRate,
                learnerParameterToCalculateOverallLossAfterEpoch);
        const confusionMatrixCrossValidation: ConfusionMatrix =
            crossValidator.crossValidate(
                columnarData.getFeaturizerLabels(),
                columnarData.getFeaturizerLabelMap(),
                columnarData.getFeaturizer().getNumberLabels(),
                columnarData.getFeaturizer().getNumberFeatures(),
                intentLabelIndexArray,
                utteranceFeatureIndexArrays,
                columnarData.getIntentInstanceIndexMapArray());
        Utility.debuggingLog(
            `, confusionMatrixCrossValidation=` +
            `${confusionMatrixCrossValidation.getMicroAverageMetrics()}` +
            `, confusionMatrixCrossValidation=` +
            `${confusionMatrixCrossValidation.getMicroAverageMetrics()}`);
    });
});
