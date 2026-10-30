/**
 * Fitting proportions in mm at DN50 (2" OD tube). Shared by the procedural
 * models and the callouts drawn over them, so this module stays tiny and
 * free of geometry code.
 */
export const FIT_RO = 25.4; // tube outer radius
export const FIT_RI = 23.8; // bore radius
export const FIT_RF = 32; // tri-clamp flange radius
export const FIT_RB = 38.1; // 3" outer radius, reducer large end
export const TC_FACE = 4.2; // depth of the tri-clamp ring behind its face

export const BEND_R = 76; // bend centreline radius
export const BEND_TAN = 24; // straight tangent at each bend end
export const TEE_HALF = 55; // tee face to centre
export const RED_HALF = 38; // reducer face to centre
export const RED_CONE = 22; // half-length of the reducer cone
