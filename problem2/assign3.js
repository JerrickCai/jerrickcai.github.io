var renderer, camera, scene, gui, stats, ambientLight, directionalLight, control, debug, spotLight, debugS, cube, objScale=4, spotLightIntensityoffset=0.1;

function initRender() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    //enable shadow in the render
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-105, 80, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function initScene() {
    scene = new THREE.Scene();
}

function initGui() {
    //initialize gui
    gui = {
        ambientLight: 0x575757, 
        directionalLight: "#ffffff", 
        intensity: 1, 
        visible: true, 
        castShadow: true, 
        //debug: true, 
        x: -50, 
        y: 80, 
        z: -25, 
        spotLightS: "#6abadc", 
        intensityS: 0.7,
        distanceS: 38,
        angleS: 1.1,
        penumbraS: 0, 
        decayS: 0.7,
        visibleS: true, 
        //debugS: true,
        xS: -5.8, 
        yS: 19, 
        zS: 15, 
        targetX: -6.2, 
        targetY: 16, 
        targetZ: 0, 
    };

    var datGui = new dat.GUI();
    
    datGui.addColor(gui, "ambientLight").name("aLight color").onChange(function (e) {
        ambientLight.color.set(e);
    });
    //directional light
    datGui.addColor(gui, "directionalLight").name("dLight color").onChange(function (e) {
        directionalLight.color.set(e);
    });
    datGui.add(gui, "intensity", 0, 5).name("dLight intensity").onChange(function (e) {
        directionalLight.intensity = e;
    });
    datGui.add(gui, "visible").name("dLight visibility").onChange(function (e) {
        directionalLight.visible = e;
    });
    datGui.add(gui, "castShadow").name("dLight shadow").onChange(function (e) {
        directionalLight.castShadow = e;
    });
    //datGui.add(gui, "debug").name("dLight debug").onChange(function (e) {debug.visible = e;});
    datGui.add(gui, "x", -50, 50).name("dLight x").onChange(changePosition);
    datGui.add(gui, "y", 0, 200).name("dLight y").onChange(changePosition);
    datGui.add(gui, "z", -50, 50).name("dLight z").onChange(changePosition);
    function changePosition() {
        directionalLight.position.set(gui.x, gui.y, gui.z);
    }

    //spot light
    datGui.addColor(gui, "spotLightS").name("sLight color").onChange(function (e) {
        spotLight.color.set(e);
    });
    datGui.add(gui, "intensityS", 0, 5).name("sLight intensity").onChange(function (e) {
        spotLight.intensity = e;
    });
    datGui.add(gui, "distanceS", 0, 300).name("sLight distance").onChange(function (e) {
        spotLight.distance = e;
    });
    datGui.add(gui, "angleS", 0, Math.PI / 2).name("sLight angle").onChange(function (e) {
        spotLight.angle = e;
    });
    datGui.add(gui, "penumbraS", 0, 1).name("sLight penumbra").onChange(function (e) {
        spotLight.penumbra = e;
    });
    datGui.add(gui, "decayS", 0, 5).name("sLight decay").onChange(function (e) {
        spotLight.decay = e;
    });
    datGui.add(gui, "visibleS").name("sLight visibility").onChange(function (e) {
        spotLight.visible = e;
    });
    //datGui.add(gui, "debugS").name("sLight debug").onChange(function (e) {debugS.visible = e;});

    datGui.add(gui, "xS", -50, 50).name("sLight x").onChange(changePositionS);
    datGui.add(gui, "yS", 0, 200).name("sLight x").onChange(changePositionS);
    datGui.add(gui, "zS", -50, 50).name("sLight x").onChange(changePositionS);
    
    function changePositionS() {
        spotLight.position.set(gui.xS, gui.yS, gui.zS);
    }

    datGui.add(gui, "targetX", -20, 20).name("sLight targetX").onChange(changeTargetPosition);
    datGui.add(gui, "targetY", 0, 20).name("sLight targetY").onChange(changeTargetPosition);
    datGui.add(gui, "targetZ", -20, 20).name("sLight targetZ").onChange(changeTargetPosition);

    function changeTargetPosition() {
        cube.position.set(gui.targetX, gui.targetY, gui.targetZ);
    }
}

function initLight() {
    ambientLight = new THREE.AmbientLight(0x575757);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight("#ffffff");
    directionalLight.position.set(-50, 80, -25);

    //Set up shadow properties for the light
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 400; 
    directionalLight.shadow.camera.left = -50; 
    directionalLight.shadow.camera.right = 50; 
    directionalLight.shadow.camera.top = 50; 
    directionalLight.shadow.camera.bottom = -50; 
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.castShadow = true;

    scene.add(directionalLight);

    // debug = new THREE.CameraHelper(directionalLight.shadow.camera);
    // debug.name = "debug";
    // scene.add(debug);

    //spotlight
    spotLight = new THREE.SpotLight("#6abadc");
    spotLight.position.set(-5.8, 19, 15);
    spotLight.intensity = 0.7
    spotLight.angle = 1.1;
    spotLight.distance = 38;
    spotLight.decay = 0.7;
    scene.add(spotLight);

    // debugS = new THREE.CameraHelper(spotLight.shadow.camera);
    // debugS.name = "debugS";
    // scene.add(debugS);

    //spotLightHelper = new THREE.SpotLightHelper(spotLight);
    //scene.add(spotLightHelper);
}

function initModel() {

    //tiny cube for setting the target of directional light
    var geometry = new THREE.BoxGeometry( 0.01, 0.01, 0.01 ); 
    var material = new THREE.MeshNormalMaterial();

    cube = new THREE.Mesh( geometry, material );
    spotLight.target = cube;
    cube.position.set(-6.2, 16, 0);
    scene.add( cube );

    //plane in the bottom
    var planeGeometry = new THREE.PlaneGeometry(100, 100);
    //set to front side, so it's not visible when looking at its back surface
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffd40f, side: THREE.frontSide});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -.1;
    plane.receiveShadow = true;
    scene.add(plane);
    
    //set up MTL loader
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('../js/models/obj/');

    mtlLoader.load('room-1.mtl', function (material) {
        //OBJ loader
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(material);
        objLoader.setPath('../js/models/obj/');
        objLoader.load('room-1.obj', function (object) {
            object.traverse(function (item) {
                if(item instanceof THREE.Mesh){
                    item.castShadow = true;
                    item.receiveShadow = true;
                }
            });
            object.scale.set(objScale,objScale,objScale);
            scene.add(object);
        })
    });

    mtlLoader.load('room-0.mtl', function (material) {
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(material);
        objLoader.setPath('../js/models/obj/');
        objLoader.load('room-0.obj', function (object) {
            object.traverse(function (item) {
                if(item instanceof THREE.Mesh){
                    item.castShadow = true;
                    item.receiveShadow = true;
                }
            });
            object.scale.set(objScale,objScale,objScale);
            scene.add(object);
        })
    });

    mtlLoader.load('room-3.mtl', function (material) {
        //var material2 = new THREE.MeshPhongMaterial({color:0x00ffff});
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(material);
        objLoader.setPath('../js/models/obj/');
        objLoader.load('room-3.obj', function (object) {
            object.traverse(function (item) {
                if(item instanceof THREE.Mesh){
                    //item.material = material2;
                    item.castShadow = true;
                    item.receiveShadow = true;
                }
            });
            object.scale.set(objScale,objScale,objScale);
            scene.add(object);
        })
    });
}

function initStats() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
}

function initControl() {
    control = new THREE.OrbitControls(camera, renderer.domElement);
}

function render() {
    control.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    render();

    //for the directional light
    if(spotLight.intensity>=2 || spotLight.intensity<=0)
        spotLightIntensityoffset*=-1;
    spotLight.intensity += spotLightIntensityoffset;
    
    stats.update();
    requestAnimationFrame(animate);
}

function draw() {
    initGui();
    initRender();
    initScene();
    initCamera();
    initLight();
    initModel();
    initStats();
    initControl();
    animate();
    window.onresize = onWindowResize;
}
