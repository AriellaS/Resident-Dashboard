const ATTRIBUTE_OPTIONS = ['Needing Attention','Developing','At Goal'];
export const SUBSPECIALTIES = ['Comprehensive','H & N / Microvascular','Rhinology','Facial Plastics','Laryngology','Otology','Pediatric'];

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
    optionTexts: SUBSPECIALTIES,
}, {
    page: 'TYPE_SURGERY',
    name: 'SURGERY',
    type: 'SHORT_TEXT',
    questionText: 'What type of surgery was performed?',
}, {
    page: 'PREPARATION',
    name: 'BRIEFING',
    type: 'RADIO',
    questionText: 'How was the pre-operative briefing performed with the resident?',
    optionTexts: ['Text/phone call the day before surgery', 'Discussion the day of surgery', 'There was no pre-operative briefing'],
}, {
    page: 'PREPARATION',
    name: 'PREP_RATING',
    type: 'RADIO',
    questionText: 'How would you rate the resident\'s preparation for the surgery?',
    optionTexts: ['1 (least)','2','3','4','5 (most)'],
}, {
    page: 'PREPARATION',
    name: 'PREP_COMMENT',
    type: 'SHORT_TEXT',
    questionText: 'Please comment on the resident\'s preparation for the procedure',
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
    page: 'INTRA_OP',
    name: 'COMPLEXITY',
    type: 'RADIO',
    questionText: 'How complex was the case relative to similar procedures?',
    optionTexts: ['Easiest 1/2','Average','Hardest 1/3'],
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
    name: 'POSOTP_PLAN',
    type: 'RADIO',
    questionText: 'Postoperative plan',
    optionTexts: ATTRIBUTE_OPTIONS,
}, {
    page: 'WRITTEN',
    name: 'POSITIVE',
    type: 'LONG_TEXT',
    questionText: 'In what ways did this resident demonstrate strong performance during the procedure?',
}, {
    page: 'WRITTEN',
    name: 'NEGATIVE',
    type: 'LONG_TEXT',
    questionText: 'In what aspects of the procedure could this resident have improved?',
}, {
    page: 'WRITTEN',
    name: 'GENERAL',
    type: 'LONG_TEXT',
    questionText: 'Generalized Feedback',
}
];
