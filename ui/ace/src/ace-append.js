try {
  // Inform dependencies that module has been loaded
  CStudioAuthoring.Module.moduleLoaded("ace", {});
} catch (e) {
  console.warn(e.message);
}
