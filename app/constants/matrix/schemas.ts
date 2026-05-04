import { EventType } from 'matrix-js-sdk'
import * as v from 'valibot'

export const EventTypeSchema = v.picklist(objectValues(EventType))
