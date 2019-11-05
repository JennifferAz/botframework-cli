/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SoftmaxRegressionSparse } from "./softmax_regression_sparse";

import { NgramSubwordFeaturizer } from "../../../../language_understanding/featurizer/ngram_subword_featurizer";

import { MathematicsHelper } from "../../../../../mathematics/mathematics_helper/mathematics_helper";

import { Utility } from "../../../../../utility/utility";

export class LearnerUtility {

    public static exampleFunctionPredictAndEvaluateTestDataset(
        featurizer: NgramSubwordFeaturizer,
        model: SoftmaxRegressionSparse,
        testDatasetFilename: string,
        labelColumnIndex: number,
        textColumnIndex: number,
        lineIndexToStart: number) {
        // -------------------------------------------------------------------
        const labels: string[] =
            featurizer.getLabels();
        // -------------------------------------------------------------------
        const intentsUtterancesDev: { "intents": string[], "utterances": string[] } =
            LearnerUtility.exampleFunctionLoadTestDataset(
                testDatasetFilename,
                labelColumnIndex,
                textColumnIndex,
                lineIndexToStart);
        const intents: string[] =
            intentsUtterancesDev.intents;
        const utterances: string[] =
            intentsUtterancesDev.utterances;
        const numberIntentUtterancesDev: number =
            intents.length;
        let countPredictionsCorrect = 0;
        for (let i: number = 0; i < numberIntentUtterancesDev; i++) {
            const intent: string =
                intents[i];
            const utterance: string =
                utterances[i];
            const utteranceFeatureIndexArray: string[] =
                new Array<string>(1);
            utteranceFeatureIndexArray[0] = utterance;
            const utteranceFeatures: number[][] =
                featurizer.createFeatureSparseIndexArrays(
                    utteranceFeatureIndexArray);
            const predictions: number[][] =
                model.predict(utteranceFeatures);
            const predictionsDataArray: number[][] =
                predictions;
            const predictionLabelIndexMax: { "indexMax": number, "max": number } =
                MathematicsHelper.getIndexOnFirstMaxEntry(predictionsDataArray[0]);
            const predictionLabelIndex: number =
                predictionLabelIndexMax.indexMax;
            const predictionLabel: string =
                labels[predictionLabelIndex];
            // Utility.debuggingLog(
            //     "" + i + "th entry: "
            //     + "labelled-intent=" + intent
            //     + ", predicted-label=" + predictionLabel
            //     + ", predicted-label-index=" + predictionLabelIndex
            //     + ", predictionLabelIndexMax=" + predictionLabelIndexMax
            //     + ", predictions=" + predictions);
            if (predictionLabel === intent) {
                countPredictionsCorrect++;
            }
        }
        const accuracy: number =
            countPredictionsCorrect / numberIntentUtterancesDev;
        Utility.debuggingLog(
            "countPredictionsCorrect=" + countPredictionsCorrect
            + ", numberIntentUtterancesDev=" + numberIntentUtterancesDev
            + ", accuracy=" + accuracy);
        // -------------------------------------------------------------------
    }

    public static exampleFunctionPredictAndEvaluateTestDatasetHashing(
        featurizer: NgramSubwordFeaturizer,
        model: SoftmaxRegressionSparse,
        testDatasetFilename: string,
        labelColumnIndex: number,
        textColumnIndex: number,
        lineIndexToStart: number) {
        // -------------------------------------------------------------------
        const labels: string[] =
            featurizer.getLabels();
        // -------------------------------------------------------------------
        const intentsUtterancesDev: { "intents": string[], "utterances": string[] } =
            LearnerUtility.exampleFunctionLoadTestDataset(
                testDatasetFilename,
                labelColumnIndex,
                textColumnIndex,
                lineIndexToStart);
        const intents: string[] =
            intentsUtterancesDev.intents;
        const utterances: string[] =
            intentsUtterancesDev.utterances;
        const numberIntentUtterancesDev: number =
            intents.length;
        let countPredictionsCorrect = 0;
        for (let i: number = 0; i < numberIntentUtterancesDev; i++) {
            const intent: string =
                intents[i];
            const utterance: string =
                utterances[i];
            const utteranceFeatureIndexArray: string[] =
                new Array<string>(1);
            utteranceFeatureIndexArray[0] = utterance;
            const utteranceFeatures: number[][] =
                featurizer.createFeatureHashingSparseIndexArrays(
                    utteranceFeatureIndexArray);
            const predictions: number[][] =
                model.predict(utteranceFeatures);
            const predictionsDataArray: number[][] =
                predictions;
            const predictionLabelIndexMax: { "indexMax": number, "max": number } =
                MathematicsHelper.getIndexOnFirstMaxEntry(predictionsDataArray[0]);
            const predictionLabelIndex: number =
                predictionLabelIndexMax.indexMax;
            const predictionLabel: string =
                labels[predictionLabelIndex];
            // Utility.debuggingLog(
            //     "" + i + "th entry: "
            //     + "labelled-intent=" + intent
            //     + ", predicted-label=" + predictionLabel
            //     + ", predicted-label-index=" + predictionLabelIndex
            //     + ", predictionLabelIndexMax=" + predictionLabelIndexMax
            //     + ", predictions=" + predictions);
            if (predictionLabel === intent) {
                countPredictionsCorrect++;
            }
        }
        const accuracy: number =
            countPredictionsCorrect / numberIntentUtterancesDev;
        Utility.debuggingLog(
            "countPredictionsCorrect=" + countPredictionsCorrect
            + ", numberIntentUtterancesDev=" + numberIntentUtterancesDev
            + ", accuracy=" + accuracy);
        // -------------------------------------------------------------------
    }

    public static exampleFunctionLoadFeaturizeTrainDataset(
        numberHashingFeaturesSetting: number = 0,
        filename: string,
        labelColumnIndex: number,
        textColumnIndex: number,
        lineIndexToStart: number,
        subwordNgramBegin: number = 3,
        subwordNgramEnd: number = 4,
        toLowercase: boolean = true,
        toRemovePunctuation: boolean = false) {
        if (!Utility.exists(filename)) {
            Utility.toPrintDebuggingLogToConsole = true;
            Utility.debuggingLog(`process.cwd()=${process.cwd()}`);
            throw Error(`The input dataset ${filename} does not exist!`);
        }
        const intentsUtterances: { "intents": string[], "utterances": string[] } =
            Utility.loadLabelTextColumnarFile(
                filename, // ---- filename: string,
                labelColumnIndex, // ---- labelColumnIndex: number = 0,
                textColumnIndex,  // ---- textColumnIndex: number = 1,
                lineIndexToStart, // ---- lineIndexToStart: number = 0,
                "\t",     // ---- columnDelimiter: string = "\t",
                "\n",     // ---- rowDelimiter: string = "\n",
                "utf8",   // ---- encoding: string = "utf8",
                -1,       // ---- lineIndexToEnd: number = -1
            );
        const featurizer: NgramSubwordFeaturizer = new NgramSubwordFeaturizer(
            subwordNgramBegin,
            subwordNgramEnd,
            toLowercase,
            toRemovePunctuation,
            numberHashingFeaturesSetting);
        featurizer.resetLabelFeatureMaps(intentsUtterances);
        return featurizer;
    }

    public static exampleFunctionLoadTestDataset(
        filename: string,
        labelColumnIndex: number,
        textColumnIndex: number,
        lineIndexToStart: number):
        { "intents": string[], "utterances": string[] } {
        if (!Utility.exists(filename)) {
            Utility.toPrintDebuggingLogToConsole = true;
            Utility.debuggingLog(`process.cwd()=${process.cwd()}`);
            throw Error(`The input dataset ${filename} does not exist!`);
        }
        const intentsUtterances: { "intents": string[], "utterances": string[] } =
            Utility.loadLabelTextColumnarFile(
                filename, // ---- filename: string,
                labelColumnIndex, // ---- labelColumnIndex: number = 0,
                textColumnIndex,  // ---- textColumnIndex: number = 1,
                lineIndexToStart, // ---- lineIndexToStart: number = 0,
                "\t",     // ---- columnDelimiter: string = "\t",
                "\n",     // ---- rowDelimiter: string = "\n",
                "utf8",   // ---- encoding: string = "utf8",
                -1,       // ---- lineIndexToEnd: number = -1
            );
        return intentsUtterances;
    }
}
