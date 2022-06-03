{
	"version":"LAYASCENE3D:02",
	"data":{
		"type":"Scene3D",
		"props":{
			"name":"SampleScene",
			"sky":{
				"material":{
					"type":"Laya.SkyBoxMaterial",
					"path":"Assets/FBX/Materials/Sky.lmat"
				},
				"mesh":"SkyBox"
			},
			"ambientColor":[
				0.212,
				0.227,
				0.259
			],
			"reflectionDecodingFormat":1,
			"reflection":"Assets/Scenes/SampleSceneGIReflection.ltcb.ls",
			"reflectionIntensity":1,
			"ambientMode":1,
			"ambientSphericalHarmonics":[
				0.2258416,
				-0.0701941,
				0,
				-5.820766E-11,
				4.365575E-11,
				9.313226E-10,
				0.0005051158,
				0,
				0.00151539,
				0.4734322,
				-0.1307609,
				0,
				-6.111804E-10,
				6.166374E-10,
				0,
				0.0003118291,
				0,
				0.0009354329,
				0.9588116,
				-0.03098155,
				0,
				2.937668E-10,
				-1.935405E-09,
				5.587935E-09,
				-0.0007710159,
				-1.928129E-10,
				-0.002313447
			],
			"ambientSphericalHarmonicsIntensity":1,
			"lightmaps":[],
			"enableFog":false,
			"fogStart":0,
			"fogRange":300,
			"fogColor":[
				0.5,
				0.5,
				0.5
			]
		},
		"child":[
			{
				"type":"Camera",
				"instanceID":0,
				"props":{
					"name":"Main Camera",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						0,
						3.09,
						-3.98
					],
					"rotation":[
						0,
						0.9659258,
						0.2588191,
						0
					],
					"scale":[
						1,
						1,
						1
					],
					"clearFlag":1,
					"orthographic":false,
					"orthographicVerticalSize":10,
					"fieldOfView":60,
					"enableHDR":true,
					"nearPlane":0.3,
					"farPlane":1000,
					"viewport":[
						0,
						0,
						1,
						1
					],
					"clearColor":[
						0.1921569,
						0.3019608,
						0.4745098,
						0
					]
				},
				"components":[],
				"child":[]
			},
			{
				"type":"DirectionLight",
				"instanceID":1,
				"props":{
					"name":"Directional Light",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						0,
						3,
						0
					],
					"rotation":[
						0.183169,
						0.8167596,
						0.3808614,
						-0.3928072
					],
					"scale":[
						1,
						1,
						1
					],
					"intensity":1,
					"lightmapBakedType":1,
					"color":[
						1,
						0.9568627,
						0.8392157
					]
				},
				"components":[],
				"child":[]
			}
		]
	}
}