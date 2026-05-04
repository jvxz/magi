import { EventType } from 'matrix-js-sdk'
import * as v from "valibot"

export const EventTypeSchema = v.union(objectValues(EventType).map(v.literal))
