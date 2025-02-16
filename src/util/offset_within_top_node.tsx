/**
 * Calculates the total character offset of a descendant text node within a top node.
 * 
 * @param {Node} ancestor_node - The ancestor node within which to calculate the offset.
 * @param {Node} decendant_node - The text node where the offset is relative to.
 * @param {number} offset - The character offset within the descendant node.
 * @returns {number} - The total offset from the start of top_node.
 * @throws {Error} If decendant_node is not inside top_node or not found.
 */
export const offset_within_top_node = (ancestor_node: Node, decendant_node: Node, offset: number) => {
    // Ensure decendant_node is inside top_node
    let node: Node | null = decendant_node;
    while (node && node !== ancestor_node) {
        node = node.parentNode;
    }
    if (!node) throw new Error("decendant_node is not inside top_node");

    const walker = document.createTreeWalker(ancestor_node, NodeFilter.SHOW_TEXT);
    let current_node = walker.nextNode();
    let total_offset = 0;

    while (current_node) {
        if (current_node === decendant_node) {
            return total_offset + offset; // Found target node, return total offset
        }
        total_offset += current_node.textContent!.length;
        current_node = walker.nextNode();
    }

    throw new Error("decendant_node not found within top_node");
};

export function get_range_character_offsets(range:Range, top_node:Node) {
    let char_count = 0;
    let start_offset:number|null = null;
    let end_offset:number|null = null;
    
    function traverse(node:Node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node === range.startContainer) {
                start_offset = char_count + range.startOffset;
            }
            if (node === range.endContainer) {
                end_offset = char_count + range.endOffset;
            }
            char_count += node.nodeValue!.length;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let child of node.childNodes) {
                traverse(child);
                if (start_offset !== null && end_offset !== null) return;
            }
        }
    }
    
    traverse(top_node);
    return { startOffset: start_offset, endOffset: end_offset };
}