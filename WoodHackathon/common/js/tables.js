// Emmissions

const OperationTables = {
    "OP1": {
        "Emmissions": "1",
        "TransportationDistance": {
            "Carbon Onshore": "123",
            "Carbon Offshore": "23",
            "Hydrogen": "100"
        },
        "StartDate": "2008",
        "EndDate": "2027",
        "Budget": "81000000",
        "Storage": "400",
        "Wells": "2",
        "PipePressure" : "10000000",
        "PipeDiam" : "0.2032",

        "OnShore": [
            {
                "Name": "Export Pipeline",
                "EndOfLife": "2035",
                "InstallationCost": "10000000",
                "DecommissionCost": "5000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Well 1",
                "EndOfLife": "2029",
                "InstallationCost": "9000000",
                "DecommissionCost": "6000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Well 2",
                "EndOfLife": "2029",
                "InstallationCost": "8000000",
                "DecommissionCost": "4000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Well 1 pipeline",
                "EndOfLife": "2029",
                "InstallationCost": "700000",
                "DecommissionCost": "400000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Well 2 pipeline",
                "EndOfLife": "2029",
                "InstallationCost": "350000",
                "DecommissionCost": "200000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Riser 1",
                "EndOfLife": "2029",
                "InstallationCost": "225000",
                "DecommissionCost": "150000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Riser 2",
                "EndOfLife": "2029",
                "InstallationCost": "225000",
                "DecommissionCost": "150000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Riser 3",
                "EndOfLife": "2029",
                "InstallationCost": "225000",
                "DecommissionCost": "150000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Jacket",
                "EndOfLife": "2035",
                "InstallationCost": "50000000",
                "DecommissionCost": "15000000",
                "H2": "0",
                "CO2": "0"
            },

            {
                "Name": "Topside Module 1",
                "EndOfLife": "2035",
                "InstallationCost": "4000000",
                "DecommissionCost": "1500000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 2",
                "EndOfLife": "2035",
                "InstallationCost": "4500000",
                "DecommissionCost": "2500000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 3",
                "EndOfLife": "2035",
                "InstallationCost": "2000000",
                "DecommissionCost": "2000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 4",
                "EndOfLife": "2035",
                "InstallationCost": "6000000",
                "DecommissionCost": "2790000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 5",
                "EndOfLife": "2029",
                "InstallationCost": "1000000",
                "DecommissionCost": "500000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Misc.",
                "EndOfLife": "2029",
                "InstallationCost": "2500000",
                "DecommissionCost": "1000000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Man Hours",
                "EndOfLife": "9999",
                "InstallationCost": "1877142",
                "DecommissionCost": "0",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Maintenance",
                "EndOfLife": "9999",
                "InstallationCost": "800000",
                "DecommissionCost": "0",
                "H2": "1",
                "CO2": "1"
            }
        ],

        "OffShore": [

            {
                "Name": "Export Pipeline",
                "EndOfLife": "2035",
                "InstallationCost": "10000000",
                "DecommissionCost": "5000000",
                "H2": "1",
                "CO2": "0"
            },

            {
                "Name": "Well 1",
                "EndOfLife": "2029",
                "InstallationCost": "9000000",
                "DecommissionCost": "6000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Well 2",
                "EndOfLife": "2029",
                "InstallationCost": "8000000",
                "DecommissionCost": "4000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Well 1 pipeline",
                "EndOfLife": "2029",
                "InstallationCost": "700000",
                "DecommissionCost": "400000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Well 2 pipeline",
                "EndOfLife": "2029",
                "InstallationCost": "350000",
                "DecommissionCost": "200000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Riser 1",
                "EndOfLife": "2029",
                "InstallationCost": "225000",
                "DecommissionCost": "150000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Riser 2",
                "EndOfLife": "2029",
                "InstallationCost": "225000",
                "DecommissionCost": "150000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Riser 3",
                "EndOfLife": "2029",
                "InstallationCost": "225000",
                "DecommissionCost": "150000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Jacket",
                "EndOfLife": "2035",
                "InstallationCost": "50000000",
                "DecommissionCost": "15000000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 1",
                "EndOfLife": "2035",
                "InstallationCost": "4000000",
                "DecommissionCost": "1500000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 2",
                "EndOfLife": "2035",
                "InstallationCost": "4500000",
                "DecommissionCost": "2500000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 3",
                "EndOfLife": "2035",
                "InstallationCost": "2000000",
                "DecommissionCost": "2000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 4",
                "EndOfLife": "2035",
                "InstallationCost": "6000000",
                "DecommissionCost": "2790000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 5",
                "EndOfLife": "2029",
                "InstallationCost": "1000000",
                "DecommissionCost": "500000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Misc.",
                "EndOfLife": "2029",
                "InstallationCost": "2500000",
                "DecommissionCost": "1000000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Man Hours",
                "EndOfLife": "9999",
                "InstallationCost": "1877142",
                "DecommissionCost": "0",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Maintenance",
                "EndOfLife": "9999",
                "InstallationCost": "800000",
                "DecommissionCost": "0",
                "H2": "1",
                "CO2": "1"
            }
        ]
    },

    "OP2": {
        "Emissions": "6",
        "TransportationDistance": {
            "Carbon Onshore": "400",
            "Carbon Offshore": "0",
            "Hydrogen": "400"
        },
        "StartDate": "2004",
        "EndDate": "2023",
        "Budget": "400000000",
        "Storage": "0",
        "Wells": "2",
        "PipePressure" : "20000000",
        "PipeDiam" : "0.4064",

        "OnShore": [
            {
                "Name": "Gas Export Pipeline",
                "Description": "16\" pipeline for transporting dehydrated natural gas back to shore.",
                "EndOfLife": "2040",
                "InstallationCost": "300000000",
                "DecommissionCost": "180000000",
                "H2": "0",
                "CO2": "0"
            },

            {
                "Name": "Production Wells",
                "Description": "This facility has production and reinjection wells on the topsides facility.",
                "EndOfLife": "2040",
                "InstallationCost": "24000000",
                "DecommissionCost": "6000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Reinjection Wells",
                "Description": "This facility has production and reinjection wells on the topsides facility.",
                "EndOfLife": "2040",
                "InstallationCost": "8000000",
                "DecommissionCost": "2000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Riser 1",
                "Description": "This component connects the platform to the Gas Export Pipeline.",
                "EndOfLife": "2040",
                "InstallationCost": "1200000",
                "DecommissionCost": "800000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Jacket",
                "Description": "This is the steel structure that goes down to the seabed and supports the platform.",
                "EndOfLife": "2040",
                "InstallationCost": "100000000",
                "DecommissionCost": "30000000",
                "H2": "0",
                "CO2": "0"
            },

            {
                "Name": "Topside Module 1",
                "Description": "A module lifted by crane onto the top of the jacket that forms the part of the platform. This module includes 3x 15 MW re-injection compressors, for re-injecting excess gas subsea for enhanced oil recovery.",
                "EndOfLife": "2040",
                "InstallationCost": "40000000",
                "DecommissionCost": "20000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 2",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module contains a liquids fractionation train.",
                "EndOfLife": "2040",
                "InstallationCost": "80000000",
                "DecommissionCost": "50000000",
                "H2": "0",
                "CO2": "0"
            },

            {
                "Name": "Topside Module 3",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module contains the power generation facilities.",
                "EndOfLife": "2040",
                "InstallationCost": "15000000",
                "DecommissionCost": "8000000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 4",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module contains living quarters for 80 personnel, control room and workshop.",
                "EndOfLife": "2040",
                "InstallationCost": "15000000",
                "DecommissionCost": "1000000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 5",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module contains equipment for the facility utilities.",
                "EndOfLife": "2040",
                "InstallationCost": "30000000",
                "DecommissionCost": "12000000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 6",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module contains the topsides production and gas injection wells.",
                "EndOfLife": "2040",
                "InstallationCost": "40000000",
                "DecommissionCost": "30000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Misc",
                "Description": "This platform currently takes 3500 man hours a week to maintain and operate.",
                "EndOfLife": "2040",
                "InstallationCost": "7000000",
                "DecommissionCost": "5000000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Man Hours",
                "Description": "",
                "EndOfLife": "9999",
                "InstallationCost": "1877142",
                "DecommissionCost": "0",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Maintenance",
                "Description": "Cost to operate and maintain the facility when operating at full production rates",
                "EndOfLife": "9999",
                "InstallationCost": "10000000",
                "DecommissionCost": "0",
                "H2": "1",
                "CO2": "1"
            }
        ],

        "OffShore": [
            {
                "Name": "Gas Export Pipeline",
                "Description": "16\" pipeline for transporting dehydrated natural gas back to shore.",
                "EndOfLife": "2040",
                "InstallationCost": "300000000",
                "DecommissionCost": "180000000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Production Wells",
                "Description": "This facility has production and reinjection wells on the topsides facility.",
                "EndOfLife": "2040",
                "InstallationCost": "24000000",
                "DecommissionCost": "6000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Reinjection Wells",
                "Description": "This facility has production and reinjection wells on the topsides facility.",
                "EndOfLife": "2040",
                "InstallationCost": "8000000",
                "DecommissionCost": "2000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Riser 1",
                "Description": "This component connects the platform to the Gas Export Pipeline.",
                "EndOfLife": "2040",
                "InstallationCost": "1200000",
                "DecommissionCost": "800000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Jacket",
                "Description": "This is the steel structure that goes down to the seabed and supports the platform.",
                "EndOfLife": "2040",
                "InstallationCost": "100000000",
                "DecommissionCost": "30000000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 1",
                "Description": "A module lifted by crane onto the top of the jacket that forms the part of the platform. This module includes 3x 15 MW re-injection compressors, for re-injecting excess gas subsea for enhanced oil recovery.",
                "EndOfLife": "2040",
                "InstallationCost": "40000000",
                "DecommissionCost": "20000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 2",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module contains a liquids fractionation train.",
                "EndOfLife": "2040",
                "InstallationCost": "80000000",
                "DecommissionCost": "50000000",
                "H2": "0",
                "CO2": "0"
            },

            {
                "Name": "Topside Module 3",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module contains the power generation facilities.",
                "EndOfLife": "2040",
                "InstallationCost": "15000000",
                "DecommissionCost": "8000000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 4",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module contains living quarters for 80 personnel, control room and workshop.",
                "EndOfLife": "2040",
                "InstallationCost": "15000000",
                "DecommissionCost": "1000000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 5",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module contains equipment for the facility utilities.",
                "EndOfLife": "2040",
                "InstallationCost": "30000000",
                "DecommissionCost": "12000000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Topside Module 6",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module contains the topsides production and gas injection wells.",
                "EndOfLife": "2040",
                "InstallationCost": "40000000",
                "DecommissionCost": "30000000",
                "H2": "0",
                "CO2": "1"
            },

            {
                "Name": "Misc",
                "Description": "This platform currently takes 3500 man hours a week to maintain and operate.",
                "EndOfLife": "2040",
                "InstallationCost": "7000000",
                "DecommissionCost": "5000000",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Man Hours",
                "Description": "",
                "EndOfLife": "9999",
                "InstallationCost": "1877142",
                "DecommissionCost": "0",
                "H2": "1",
                "CO2": "1"
            },

            {
                "Name": "Maintenance",
                "Description": "Cost to operate and maintain the facility when operating at full production rates",
                "EndOfLife": "9999",
                "InstallationCost": "10000000",
                "DecommissionCost": "0",
                "H2": "1",
                "CO2": "1"
            }
        ]
    },

    "OP3": {
        "Emmissions": "1.5",
        "TransportationDistance": {
            "Carbon Onshore": "30",
            "Carbon Offshore": "0",
            "Hydrogen": "30"
        },
        "StartDate": "2015",
        "EndDate": "2025",
        "Budget": "190000000",
        "Storage": "625",
        "Wells": "3",
        "PipePressure" : "20000000",
        "PipeDiam" : "0.4064",

        "OnShore": [
            {
                "Name": "Gas Export Pipeline",
                "Description": "16 inch pipeline for transporting water saturated natural gas back to shore.",
                "EndOfLife": "2050",
                "InstallationCost": "22500000",
                "DecommissionCost": "13500000",
                "H2": "0",
                "CO2": "1"
            },
            {
                "Name": "Production Wells",
                "Description": "This facility has production wells on the topsides facility.",
                "EndOfLife": "2040",
                "InstallationCost": "12000000",
                "DecommissionCost": "3000000",
                "H2": "0",
                "CO2": "1"
            },
            {
                "Name": "Riser 1",
                "Description": "This component connects the platform to the Gas Export Pipeline.",
                "EndOfLife": "2040",
                "InstallationCost": "300000",
                "DecommissionCost": "200000",
                "H2": "0",
                "CO2": "1"
            },
            {
                "Name": "Jacket",
                "Description": "This is the steel structure that goes down to the seabed and supports the platform.",
                "EndOfLife": "2050",
                "InstallationCost": "50000000",
                "DecommissionCost": "15000000",
                "H2": "0",
                "CO2": "1"
            },
            {
                "Name": "Topside Module 1",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module includes a compressor and separator.",
                "EndOfLife": "2050",
                "InstallationCost": "4000000",
                "DecommissionCost": "1500000",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Topside Module 2",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module includes a microturbine for power generation.",
                "EndOfLife": "2050",
                "InstallationCost": "4500000",
                "DecommissionCost": "2500000",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Topside Module 3",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module includes utilities and chemical injection equipment.",
                "EndOfLife": "2050",
                "InstallationCost": "2000000",
                "DecommissionCost": "2000000",
                "H2": "0",
                "CO2": "1"
            },
            {
                "Name": "Topside Module 4",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module includes communications and electrical equipment.",
                "EndOfLife": "2050",
                "InstallationCost": "6000000",
                "DecommissionCost": "2790000",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Topside Module 5",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module contains the already decommissioned helipad and laydown area, providing a large open space.",
                "EndOfLife": "2050",
                "InstallationCost": "6000000",
                "DecommissionCost": "1000000",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Misc.",
                "Description": "All other components that are not included as part of a module.",
                "EndOfLife": "2050",
                "InstallationCost": "7000000",
                "DecommissionCost": "5000000",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Man Hours",
                "Description": "This platform currently takes 600 man hours a week to maintain and operate.",
                "EndOfLife": "9999",
                "InstallationCost": "1877142",
                "DecommissionCost": "0",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Maintenance",
                "Description": "Cost to operate and maintain the facility when operating at full production rates",
                "EndOfLife": "9999",
                "InstallationCost": "1500000",
                "DecommissionCost": "0",
                "H2": "1",
                "CO2": "1"
            }
        ],
        "OffShore": [
            {
                "Name": "Gas Export Pipeline",
                "Description": "16 inch pipeline for transporting water saturated natural gas back to shore.",
                "EndOfLife": "2050",
                "InstallationCost": "22500000",
                "DecommissionCost": "13500000",
                "H2": "1",
                "CO2": "0"
            },
            {
                "Name": "Production Wells",
                "Description": "This facility has production wells on the topsides facility.",
                "EndOfLife": "2040",
                "InstallationCost": "12000000",
                "DecommissionCost": "3000000",
                "H2": "0",
                "CO2": "1"
            },
            {
                "Name": "Riser 1",
                "Description": "This component connects the platform to the Gas Export Pipeline.",
                "EndOfLife": "2040",
                "InstallationCost": "300000",
                "DecommissionCost": "200000",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Jacket",
                "Description": "This is the steel structure that goes down to the seabed and supports the platform.",
                "EndOfLife": "2050",
                "InstallationCost": "50000000",
                "DecommissionCost": "15000000",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Topside Module 1",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module includes a compressor and separator.",
                "EndOfLife": "2050",
                "InstallationCost": "4000000",
                "DecommissionCost": "1500000",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Topside Module 2",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module includes a microturbine for power generation.",
                "EndOfLife": "2050",
                "InstallationCost": "4500000",
                "DecommissionCost": "2500000",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Topside Module 3",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module includes utilities and chemical injection equipment.",
                "EndOfLife": "2050",
                "InstallationCost": "2000000",
                "DecommissionCost": "2000000",
                "H2": "0",
                "CO2": "1"
            },
            {
                "Name": "Topside Module 4",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module includes communications and electrical equipment.",
                "EndOfLife": "2050",
                "InstallationCost": "6000000",
                "DecommissionCost": "2790000",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Topside Module 5",
                "Description": "A module lifted by crane onto the top of the jacket that forms the top of the platform. This module contains the already decommissioned helipad and laydown area, providing a large open space.",
                "EndOfLife": "2050",
                "InstallationCost": "6000000",
                "DecommissionCost": "1000000",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Misc.",
                "Description": "All other components that are not included as part of a module.",
                "EndOfLife": "2050",
                "InstallationCost": "7000000",
                "DecommissionCost": "5000000",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Man Hours",
                "Description": "This platform currently takes 600 man hours a week to maintain and operate.",
                "EndOfLife": "9999",
                "InstallationCost": "1877142",
                "DecommissionCost": "0",
                "H2": "1",
                "CO2": "1"
            },
            {
                "Name": "Maintenance",
                "Description": "Cost to operate and maintain the facility when operating at full production rates",
                "EndOfLife": "9999",
                "InstallationCost": "1500000",
                "DecommissionCost": "0",
                "H2": "1",
                "CO2": "1"
            }
        ]
    }
}