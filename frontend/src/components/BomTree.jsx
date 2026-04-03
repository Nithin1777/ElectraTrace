function BomNode({ node, onDelete, onSelect, selectedId }) {
  const isSelected = selectedId === node.BOM_ItemID;

  return (
    <li
      className={`mt-2 rounded-md border p-3 transition-all ${
        isSelected
          ? "border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.2)]"
          : "border-slate-700 bg-slate-900"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect?.(node.BOM_ItemID)}
        className="flex w-full flex-wrap items-center justify-between gap-2 text-left"
      >
        <div>
          <p className="font-medium text-cyan-200">{node.MPN}</p>
          <p className="text-sm text-slate-400">{node.Description}</p>
          <p className="mt-1 text-xs text-slate-300">
            Qty: {node.Quantity_Required} • Status: {node.Status}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSelected && (
            <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-[10px] font-semibold text-cyan-300 ring-1 ring-inset ring-cyan-500/30">
              Selected
            </span>
          )}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(node.BOM_ItemID);
            }}
            className="rounded-md bg-rose-600 px-2 py-1 text-xs font-semibold hover:bg-rose-500"
          >
            Remove
          </button>
        </div>
      </button>

      {node.children?.length > 0 && (
        <ul className="ml-4 mt-2 border-l border-slate-700 pl-3">
          {node.children.map((child) => (
            <BomNode
              key={child.BOM_ItemID}
              node={child}
              onDelete={onDelete}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function BomTree({ nodes, onDelete, onSelect, selectedId }) {
  if (!nodes.length) {
    return <p className="text-slate-400">No BOM items yet.</p>;
  }

  return (
    <ul>
      {nodes.map((node) => (
        <BomNode
          key={node.BOM_ItemID}
          node={node}
          onDelete={onDelete}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      ))}
    </ul>
  );
}

export default BomTree;
