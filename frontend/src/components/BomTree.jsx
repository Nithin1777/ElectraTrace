function BomNode({ node, onDelete }) {
  return (
    <li className="mt-2 rounded-md border border-slate-700 bg-slate-900 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-medium text-cyan-200">{node.MPN}</p>
          <p className="text-sm text-slate-400">{node.Description}</p>
          <p className="mt-1 text-xs text-slate-300">
            Qty: {node.Quantity_Required} • Status: {node.Status}
          </p>
        </div>
        <button
          onClick={() => onDelete(node.BOM_ItemID)}
          className="rounded-md bg-rose-600 px-2 py-1 text-xs font-semibold hover:bg-rose-500"
        >
          Remove
        </button>
      </div>

      {node.children?.length > 0 && (
        <ul className="ml-4 mt-2 border-l border-slate-700 pl-3">
          {node.children.map((child) => (
            <BomNode key={child.BOM_ItemID} node={child} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </li>
  );
}

function BomTree({ nodes, onDelete }) {
  if (!nodes.length) {
    return <p className="text-slate-400">No BOM items yet.</p>;
  }

  return (
    <ul>
      {nodes.map((node) => (
        <BomNode key={node.BOM_ItemID} node={node} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default BomTree;
