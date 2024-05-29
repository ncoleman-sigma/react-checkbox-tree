import {
  useConfig,
  useEditorPanelConfig,
  useElementData,
  useVariable,
} from "@sigmacomputing/plugin";
import { useMemo, useState } from "react";
import CheckboxTree from "react-checkbox-tree";

interface Node_t {
  value: string;
  label: string;
  children?: Node_t[];
}

function App() {
  useEditorPanelConfig([
    { type: "element", name: "source" },
    { type: "column", name: "label", source: "source", allowMultiple: false },
    { type: "column", name: "value", source: "source", allowMultiple: false },
    { type: "column", name: "depth", source: "source", allowMultiple: false },
    { type: "column", name: "sortorder", source: "source", allowMultiple: false },
    { type: "variable", name: "filterControl" },
  ]);

  const config = useConfig();
  const sigmaData = useElementData(config.source);

  const inputSortOrderArray = [...[sigmaData[config.sortorder]]][0];
  const inputValuesArray = [...[sigmaData[config.value]]][0];
  const inputLabelsArray = [...[sigmaData[config.label]]][0];
  const inputDepthArray = [...[sigmaData[config.depth]]][0];

  let sortedValues: string | any[] = [];
  let sortedLabels: string | any[] = [];
  let sortedDepths: any[] = [];

  if (inputValuesArray !== undefined && inputSortOrderArray !== undefined && inputLabelsArray !== undefined && inputDepthArray !== undefined) {

    const valuesSortingArray = inputValuesArray.map((item, index) => ({ label: item, sortorder: inputSortOrderArray[index] }));
    valuesSortingArray.sort((a, b) => a.sortorder - b.sortorder);
    sortedValues = valuesSortingArray.map(item => item.label);

    const labelsSortingArray = inputLabelsArray.map((item, index) => ({ label: item, sortorder: inputSortOrderArray[index] }));
    labelsSortingArray.sort((a, b) => a.sortorder - b.sortorder);
    sortedLabels = labelsSortingArray.map(item => item.label);

    const depthSortingArray = inputDepthArray.map((item, index) => ({ label: item, sortorder: inputSortOrderArray[index] }));
    depthSortingArray.sort((a, b) => a.sortorder - b.sortorder);
    sortedDepths = depthSortingArray.map(item => item.label);

    //console.log(sortedValues);
    //console.log(sortedLabels);
    //console.log(sortedDepths);
    
  }

  const [filterValue, setFilter] = useVariable(config.filterControl);
  // @ts-expect-error lib definitions need updates
  const [expanded, setExpanded] = useState(filterValue?.defaultValue.value);

  const treeData = useMemo(() => {

    if (
      !sortedValues?.length ||
      !sortedLabels?.length ||
      !sortedDepths?.length ||
      !sigmaData[config.sortorder]?.length
    ) {
      return [];
    }

    const rootNode: Node_t = {
      value: sortedValues[0],
      label: sortedLabels[0],
    };
    const data = [rootNode];
    const stack = [rootNode];

    for (let i = 1; i < sortedValues.length; i++) {
      const node = {
        value: sortedValues[i],
        label: sortedLabels[i],
      };
      const currentDepth = sortedDepths[i];
      stack[currentDepth] = node;
      if (!stack[currentDepth - 1].children) {
        stack[currentDepth - 1].children = [];
      }
      stack[currentDepth - 1].children?.push(node);
    }
    return data;
  }, [config.depth, config.label, config.value, sigmaData]);

  return (
    <CheckboxTree
      nodes={treeData}
      // @ts-expect-error lib definitions need updates
      checked={filterValue?.defaultValue.value}
      expanded={expanded}
      checkModel="all"
      expandOnClick
      onExpand={nodes => setExpanded(nodes)}
      onCheck={(selectedNodes) => {
        console.log(selectedNodes);
        if (selectedNodes.length) {
          setFilter(selectedNodes.join(","))
        } else {
          setFilter(null);
        }
      }}
      iconsClass="fa4"
    />
  );
}

export default App;
