/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { isNull } from "util";
import { isUndefined } from "util";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/ngram_subword_featurizer";

import { Utility } from "../utility/utility";

export class Data {

    protected luContent: string = "";
    protected luUtterances: any[] = [];
    protected intentInstanceIndexMapArray: Map<string, number[]> = new Map<string, number[]>();
    protected entityTypeInstanceIndexMapArray: Map<string, number[]> = new Map<string, number[]>();

    protected intentsUtterances: {
        "intents": string[],
        "utterances": string[] } =
        { intents: [], utterances: [] };
    protected intentUtteranceSparseIndexArrays: {
        "intentLabelIndexArray": number[],
        "utteranceFeatureIndexArrays": number[][] } =
        { intentLabelIndexArray: [], utteranceFeatureIndexArrays: [] };

    protected featurizer: NgramSubwordFeaturizer;

    protected constructor(featurizer: NgramSubwordFeaturizer) {
        if (isNull(featurizer) || (isUndefined(featurizer))) {
            Utility.debuggingThrow(
                "input featurizer is null");
        }
        this.featurizer = featurizer;
    }

    public collectEntityTypes(luUtterances: any[]): Map<string, number[]> {
        const entityTypeInstanceIndexMapArray: Map<string, number[]> = new Map<string, number[]>();
        luUtterances.forEach((element: any, index: number) => {
            const entities: any[] = element.entities;
            entities.forEach((entityElement: any) => {
                const entityType: string = entityElement.entity as string;
                if (entityType) {
                    Utility.addKeyValueToNumberMapArray(
                        entityTypeInstanceIndexMapArray,
                        entityType,
                        index);
                }
            });
        });
        return entityTypeInstanceIndexMapArray;
    }
    public collectIntents(luUtterances: any[]): Map<string, number[]> {
        const intentInstanceIndexMapArray: Map<string, number[]> = new Map<string, number[]>();
        luUtterances.forEach((element: any, index: number) => {
            const intent: string = element.intent as string;
            if (intent) {
                Utility.addKeyValueToNumberMapArray(
                    intentInstanceIndexMapArray,
                    intent,
                    index);
            }
        });
        return intentInstanceIndexMapArray;
    }

    public getLuContent(): string {
        return this.luContent;
    }
    public getLuObject(): any {
        return null;
    }
    public getLuJsonStructure(): any {
        return null;
    }
    public getLuUtterances(): any[] {
        return this.luUtterances;
    }
    public getIntentInstanceIndexMapArray(): Map<string, number[]> {
        return this.intentInstanceIndexMapArray;
    }
    public getEntityTypeInstanceIndexMapArray(): Map<string, number[]> {
        return this.entityTypeInstanceIndexMapArray;
    }

    public dumpLuObject(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): void {
            return;
    }
    public dumpLuJsonStructure(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): void {
            return;
    }
    public dumpLuUtterances(
        filename: string,
        replacer?: (this: any, key: string, value: any) => any,
        space?: string | number): void {
        Utility.dumpFile(
            filename,
            JSON.stringify(
                this.getLuUtterances(),
                replacer,
                space));
    }

    public getNumberLuUtterances(): number {
        return this.getLuUtterances().length;
    }
    public getNumberIntents(): number {
        return this.getIntentInstanceIndexMapArray().size;
    }
    public getNumberEntityTypes(): number {
        return this.getEntityTypeInstanceIndexMapArray().size;
    }

    public getIntentsUtterances(): {
        "intents": string[],
        "utterances": string[] } {
        return this.intentsUtterances;
    }
    public getIntents(): string[] {
        return this.intentsUtterances.intents;
    }
    public getUtterances(): string[] {
        return this.intentsUtterances.utterances;
    }

    public getIntentUtteranceSparseIndexArrays(): {
        "intentLabelIndexArray": number[],
        "utteranceFeatureIndexArrays": number[][] } {
        return this.intentUtteranceSparseIndexArrays;
    }
    public getIntentLabelIndexArray(): number[] {
        return this.intentUtteranceSparseIndexArrays.intentLabelIndexArray;
    }
    public getUtteranceFeatureIndexArrays(): number[][] {
        return this.intentUtteranceSparseIndexArrays.utteranceFeatureIndexArrays;
    }

    public featurizeIntentsUtterances(): void {
        this.getFeaturizer().resetLabelFeatureMaps(
            this.getIntentsUtterances());
        this.intentUtteranceSparseIndexArrays =
            this.getFeaturizer().createIntentUtteranceSparseIndexArrays(
                this.getIntentsUtterances());
    }
    public featurize(inputUtterance: string): string[] {
        return this.getFeaturizer().featurize(inputUtterance);
    }
    public getFeaturizer(): NgramSubwordFeaturizer {
        return this.featurizer;
    }
    public getFeaturizerLabels(): string[] {
        return this.getFeaturizer().getLabels();
    }
    public getFeaturizerLabelMap(): { [id: string]: number; } {
        return this.getFeaturizer().getLabelMap();
    }
    public getFeaturizerFeatures(): string[] {
        return this.getFeaturizer().getFeatures();
    }
    public getFeaturizerFeatureMap(): { [id: string]: number; } {
        return this.getFeaturizer().getFeatureMap();
    }

    public collectUtteranceIndexSetSeedingIntentTrainingSet(
        seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>>,
        candidateUtteranceIndexSet: Set<number>,
        limitInitialNumberOfInstancesPerCategory: number = 10): {
            "seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels": Map<string, Set<number>>,
            "candidateUtteranceIndexSetSampled": Set<number>,
            "candidateUtteranceIndexSetRemaining": Set<number>,
        } {
        const candidateUtteranceIndexSetSampled: Set<number> = new Set<number>();
        for (const luUtteranceIndex of candidateUtteranceIndexSet) {
            const luUtterance: any =
                this.luUtterances[luUtteranceIndex];
            const intent: string =
                luUtterance.intent as string;
            const utteranceIndexIntentSet: Set<number> =
                seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels.get(intent) as Set<number>;
            const existingNumberUtterances: number =
                utteranceIndexIntentSet.size;
            if ((limitInitialNumberOfInstancesPerCategory < 0) ||
                (existingNumberUtterances < limitInitialNumberOfInstancesPerCategory)) {
                utteranceIndexIntentSet.add(luUtteranceIndex);
                candidateUtteranceIndexSetSampled.add(luUtteranceIndex);
            }
        }
        const candidateUtteranceIndexSetRemaining: Set<number> =
            new Set<number>([...candidateUtteranceIndexSet].filter((entry: number) => {
                return !candidateUtteranceIndexSetSampled.has(entry);
            }));
        return {
            candidateUtteranceIndexSetRemaining,
            candidateUtteranceIndexSetSampled,
            seedingUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
        };
    }

    public collectSmallUtteranceIndexSetCoveringAllIntentEntityLabels(
        toShuffle: boolean = true,
        toEnsureEachIntentHasOneUtteranceLabel: boolean = true,
        toEnsureEachEntityTypeHasOneUtteranceLabel: boolean = true): {
            "smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels": Map<string, Set<number>>,
            "smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels": Map<string, Set<number>>,
            "smallUtteranceIndexSetCoveringAllIntentEntityLabels": Set<number>,
            "remainingUtteranceIndexSet": Set<number>,
        } {
        const luUtteranceIndexes: number[] =
            Array.from(Array(this.getNumberLuUtterances()).keys());
        if (toShuffle) {
            Utility.shuffle(luUtteranceIndexes);
        }
        const smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
            new Map<string, Set<number>>();
        const smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels: Map<string, Set<number>> =
            new Map<string, Set<number>>();
        const smallUtteranceIndexSetCoveringAllIntentEntityLabels: Set<number> =
            new Set<number>();
        if (toEnsureEachIntentHasOneUtteranceLabel || toEnsureEachEntityTypeHasOneUtteranceLabel) {
            const numberIntents: number =
                this.getNumberIntents();
            const numberEntityTypes: number =
                this.getNumberEntityTypes();
            const intentSet: Set<string> =
                new Set<string>();
            const entityTypeSet: Set<string> =
                new Set<string>();
            for (let i: number = 0; i < luUtteranceIndexes.length; i++) {
                const luUtteranceIndex: number = luUtteranceIndexes[i];
                const luUtterance: any = this.luUtterances[luUtteranceIndex];
                let hasNewUtteranceFoundForCoveringAllIntentEntityLabels: boolean = false;
                if (toEnsureEachIntentHasOneUtteranceLabel) {
                    if (intentSet.size < numberIntents) {
                        const intent: string = luUtterance.intent as string;
                        if (!(intentSet.has(intent))) {
                            intentSet.add(intent);
                            hasNewUtteranceFoundForCoveringAllIntentEntityLabels = true;
                            Utility.debuggingLog(
                                `i=${i}, ` +
                                `luUtteranceIndex=${luUtteranceIndex}, ` +
                                `intent=${intent}, ` +
                                `intentSet.size=${intentSet.size}, ` +
                                `smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
                                `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
                        }
                    }
                }
                if (toEnsureEachEntityTypeHasOneUtteranceLabel) {
                    if (entityTypeSet.size < numberEntityTypes) {
                        const entities: any[] = luUtterance.entities;
                        entities.forEach((entityElement: any) => {
                            const entityType: string = entityElement.entity as string;
                            if (entityType) {
                                if (!(entityTypeSet.has(entityType))) {
                                    entityTypeSet.add(entityType);
                                    hasNewUtteranceFoundForCoveringAllIntentEntityLabels = true;
                                    Utility.debuggingLog(
                                        `i=${i}, ` +
                                        `luUtteranceIndex=${luUtteranceIndex}, ` +
                                        `entityType=${entityType}, ` +
                                        `entityTypeSet.size=${entityTypeSet.size}, ` +
                                        `smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
                                        `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
                                }
                            }
                        });
                    }
                }
                if (hasNewUtteranceFoundForCoveringAllIntentEntityLabels) {
                    {
                        smallUtteranceIndexSetCoveringAllIntentEntityLabels.add(luUtteranceIndex);
                    }
                    {
                        const intent: string = luUtterance.intent as string;
                        Utility.addKeyValueToNumberMapSet(
                            smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
                            intent,
                            luUtteranceIndex);
                    }
                    {
                        const entities: any[] = luUtterance.entities;
                        entities.forEach((entityElement: any) => {
                            const entityType: string = entityElement.entity as string;
                            if (entityType) {
                                Utility.addKeyValueToNumberMapSet(
                                    smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels,
                                    entityType,
                                    luUtteranceIndex);
                            }
                        });
                    }
                    Utility.debuggingLog(
                        `i=${i}, ` +
                        `luUtteranceIndex=${luUtteranceIndex}, ` +
                        `smallUtteranceIndexSetCoveringAllIntentEntityLabels.size=` +
                        `${smallUtteranceIndexSetCoveringAllIntentEntityLabels.size}`);
                }
                if (toEnsureEachIntentHasOneUtteranceLabel && (intentSet.size < numberIntents)) {
                    continue;
                }
                if (toEnsureEachEntityTypeHasOneUtteranceLabel && (entityTypeSet.size < numberEntityTypes)) {
                    continue;
                }
                {
                    break;
                }
            }
        }
        const remainingUtteranceIndexSet: Set<number> =
            new Set<number>(luUtteranceIndexes.filter((entry: number) => {
                return !smallUtteranceIndexSetCoveringAllIntentEntityLabels.has(entry);
            }));
        return {
            remainingUtteranceIndexSet,
            smallUtteranceIndexEntityTypeMapCoveringAllIntentEntityLabels,
            smallUtteranceIndexIntentMapCoveringAllIntentEntityLabels,
            smallUtteranceIndexSetCoveringAllIntentEntityLabels,
        };
    }
}
