export const buildBomTree = (items = []) => {
  const map = new Map();
  const roots = [];

  items.forEach((item) => {
    map.set(item.BOM_ItemID, { ...item, children: [] });
  });

  map.forEach((node) => {
    if (node.parent_BOM_ItemID && map.has(node.parent_BOM_ItemID)) {
      map.get(node.parent_BOM_ItemID).children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};
