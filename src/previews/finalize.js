/* Bind exact records, differences and comparison groups. Never mark unmapped content done. */
for(const [name,item] of waveRegistry){
 const record=entries.find(e=>e.en===name);if(!record)throw new Error('Unbound preview term: '+name);
 const before=item.draw(item.key,.19,record),after=item.draw(item.key,.83,record);
 if(!before||!after)throw new Error('Incomplete preview renderer: '+name);
 item.interactive=item.interactive&&before!==after;
 if(!record.difference){record.difference=item.ko;record.translations??={};record.translations.en??={};record.translations.en.difference=item.en;}
 record.preview={engine:'atlas-wave1',key:`wave1-${item.family}-${item.key}`,classification:item.interactive?'interactive-study':'illustration',sampleData:false};
 Object.assign(byId.get(record.id),record);
}
const waveComparisons=[
 ['Easing','Interpolation','Cubic Bézier Easing'],
 ['Stiffness','Damping','Mass'],
 ['Keyframe','Animation Timeline','Motion Choreography'],
 ['Frame Budget','Frame Pacing','Jank'],
 ['Scroll-triggered Animation','Scroll-driven Animation','Scroll Reveal','Sticky Pinning','Parallax'],
 ['Rubber Banding','Snap-back','Snap Point','Drag-to-dismiss'],
 ['Squash and Stretch','Anticipation','Follow-through','Secondary Motion','Motion Arc'],
 ['Shared Element Transition','Container Transform','Layout Animation','Expand / Collapse Motion'],
 ['Particle Lifetime','Normalized Age','Color over Lifetime','Size over Lifetime','Rotation over Lifetime'],
 ['Gravity Force','Drag Force','Attractor','Repulsor','Vortex Force'],
 ['Vector Field','Particle Flow Field','Curl Noise','Turbulence'],
 ['Particle Collision','Restitution','Collision Friction'],
 ['Local-space Simulation','World-space Simulation','Inherit Velocity'],
 ['Spawn Rate','Burst Emission','One-shot Effect','Looping Emitter'],
 ['Sprite Particle','Mesh Particle','Stretched Billboard','Billboard'],
 ['Texture Atlas','Flipbook Texture','Texture Sheet Animation'],
 ['Alpha Mask','Alpha Clip','Erosion Mask'],
 ['Additive Blending','Alpha Blending','Multiplicative Blending','Premultiplied Alpha'],
 ['Muzzle Flash','Bullet Tracer','Projectile Effect','Impact Spark'],
 ['Critical Path','Golden Path','Optional Path','Shortcut','Looping Path'],
 ['Chokepoint','Flanking Route','Cover Placement','Combat Arena'],
 ['Sightline','Line of Sight','Landmark','Vista','Reveal'],
 ['Gating','Soft Gate','Hard Gate','Softlock'],
 ['A* Search','Dijkstra Algorithm','Breadth-first Search','Flood Fill','Reachability','Connectivity Check'],
 ['Tileset','Tilemap','Autotiling','Collision Layer','Object Layer'],
 ['Hex Grid','Isometric Grid'],
 ['Mesh','Vertex','Edge','Face','Polygon','Topology'],
 ['Bevel','Extrude','Inset','Subdivision Surface','Decimation'],
 ['UV Mapping','UV Unwrap','UV Island','UV Seam'],
 ['Bump Map','Normal Map','Displacement Map'],
 ['Roughness','Metallic','Albedo / Base Color','Emission','Transmission'],
 ['Near / Far Clip Plane','Frustum Culling','Occlusion Culling','Back-face Culling'],
 ['Orbit Controls','Pan Controls','Zoom / Dolly']
];
for(const group of waveComparisons){const matched=group.map(name=>entries.find(e=>e.en===name)).filter(Boolean);for(const e of matched){if(!waveRegistry.has(e.en))continue;e.compare_ids=[...new Set([...(e.compare_ids||[]),...matched.filter(x=>x.id!==e.id).map(x=>x.id)])].slice(0,5);Object.assign(byId.get(e.id),e);}}
