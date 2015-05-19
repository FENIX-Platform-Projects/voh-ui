define({
    "rows": [
        'geo_label'
    ],
    "cols": ['variable', 'group_code'],
    "vals": [
        'ms'
    ],
    "hiddenAttributes": [
        "geo",
        "s"
    ],
    "InstanceRenderers": [
        {label: "Grid", func: "Table"},
        {label: "Table", func: "Table2"}
    ],
    "InstanceAggregators": [
        {label: "Sum", func: "Sum"},
        { label: "Average", func: "Average" }
    ]
});