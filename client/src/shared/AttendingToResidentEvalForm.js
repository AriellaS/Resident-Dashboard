const ATTRIBUTE_OPTIONS = ['Needing Attention','Developing','At Goal'];
export const SUBSPECIALTIES = [{
    name: 'Comprehensive',
    color: '#ff7b61'
}, {
    name: 'H & N / Microvascular',
    color: '#786bff'
}, {
    name: 'Rhinology',
    color: '#8f2e45'
}, {
    name: 'Facial Plastics',
    color: '#ff87f3'
}, {
    name: 'Laryngology',
    color: '#5eb9e0'
}, {
    name: 'Otology',
    color: '#ce83fc'
}, {
    name: 'Pediatric',
    color: '#c9b853'
}];


export const Pages = [{
    name: 'TYPE_SURGERY',
    text: 'Type of Surgery',
}, {
    name: 'PREPARATION',
    text: 'Preparation',
}, {
    name: 'INTRA_OP',
    text: 'Intra-operative feedback',
}, {
    name: 'ATTRIBUTES',
    text: 'Attributes',
}, {
    name: 'WRITTEN',
    text: 'Written Feedback',
}];

export const Questions = [{
    page: 'TYPE_SURGERY',
    name: 'DATE_SURGERY',
    type: 'DATE',
    questionText: 'Date of surgery'
}, {
    page: 'TYPE_SURGERY',
    name: 'SUBSPECIALTY',
    type: 'RADIO',
    questionText: 'Otolaryngology Subspecialty',
    optionTexts: SUBSPECIALTIES.flatMap(s => s.name),
}, {
    page: 'TYPE_SURGERY',
    name: 'SURGERY',
    type: 'SHORT_TEXT',
    questionText: 'What type of surgery was performed?',
}, {
    page: 'PREPARATION',
    name: 'PREP_RATING',
    type: 'RADIO',
    questionText: 'How would you rate the resident\'s preparation for the surgery?',
    optionTexts: ['1 (least)','2','3','4','5 (most)'],
}, {
    page: 'INTRA_OP',
    name: 'GUIDANCE',
    type: 'RADIO',
    questionText: 'How much guidance did you provide for the majority of the critical portions of the case?',
    optionTexts: ['Show and tell','Active help','Passive help','Supervision only'],
}, {
    page: 'INTRA_OP',
    name: 'PERFORMANCE',
    type: 'RADIO',
    questionText: 'What was the resident\'s performance for the majority of the critical portions of this case?',
    optionTexts: ['Unprepared/critical deficiency','Inexperienced with the procedure','Intermediate performance','Practice ready performance','Exceptional performance'],
}, {
    page: 'ATTRIBUTES',
    name: 'KNOWLEDGE',
    type: 'RADIO',
    questionText: 'Procedural Knowledge',
    optionTexts: ATTRIBUTE_OPTIONS,
}, {
    page: 'ATTRIBUTES',
    name: 'OP_PLAN',
    type: 'RADIO',
    questionText: 'Operative Plan',
    optionTexts: ATTRIBUTE_OPTIONS,
}, {
    page: 'ATTRIBUTES',
    name: 'APPROACH',
    type: 'RADIO',
    questionText: 'Incision/Approach',
    optionTexts: ATTRIBUTE_OPTIONS,
}, {
    page: 'ATTRIBUTES',
    name: 'PLANES',
    type: 'RADIO',
    questionText: 'Tissue planes',
    optionTexts: ATTRIBUTE_OPTIONS,
}, {
    page: 'ATTRIBUTES',
    name: 'HANDLING',
    type: 'RADIO',
    questionText: 'Tissue handling',
    optionTexts: ATTRIBUTE_OPTIONS,
}, {
    page: 'ATTRIBUTES',
    name: 'INSTRUMENT',
    type: 'RADIO',
    questionText: 'Instrument choice and use',
    optionTexts: ATTRIBUTE_OPTIONS,
}, {
    page: 'ATTRIBUTES',
    name: 'POSTOP_PLAN',
    type: 'RADIO',
    questionText: 'Postoperative plan',
    optionTexts: ATTRIBUTE_OPTIONS,
}, {
    page: 'WRITTEN',
    name: 'POSITIVE',
    type: 'LONG_TEXT',
    questionText: 'Please list 2-3 strengths the resident displayed during the procedure.',
}, {
    page: 'WRITTEN',
    name: 'NEGATIVE',
    type: 'LONG_TEXT',
    questionText: 'Please list 2-3 ways the resident could have improved.',
}];
