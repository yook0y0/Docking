package org.docking.erbse.analysis.filter.process;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.docking.erbse.analysis.DockingStream;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.Attribute;
import org.docking.erbse.analysis.attribute.DataAttribute;
import org.docking.erbse.analysis.attribute.IndexAttribute;
import org.docking.erbse.analysis.filter.Filter;

public abstract class DataProcessFilter extends Filter{

	public DataProcessFilter(DockingStream stream) {
		super(stream);
		// TODO Auto-generated constructor stub
	}

	@Override
	public Map<Integer, Attribute> analyze() {
		// TODO Auto-generated method stub
		DataAttribute dAttr = null;
		dAttr = (DataAttribute)this.getAttrSet().get(Attr.DATA_ATTR);

		IndexAttribute iAttr = new IndexAttribute();
		super.addAttr(Attr.INDEX_ATTR, iAttr);

		List<Integer> startWidth = new ArrayList<Integer>();
		List<Integer> endWidth = new ArrayList<Integer>();

		int[][] startIndex = null;
		int[][] endIndex = null;

		if(dAttr != null){			
			byte[][] data = dAttr.getData();

			startIndex = new int[data.length][];
			endIndex = new int[data.length][];

			for(int i=0;i<data.length;i++){
				data[i] = this.process(data[i],startWidth,endWidth);
				
				startIndex[i] = new int[startWidth.size()];
				endIndex[i] = new int[startWidth.size()];

				for(int j=0;j<startWidth.size();j++){
					startIndex[i][j] = startWidth.get(j).intValue();
					endIndex[i][j] = endWidth.get(j).intValue();
				}
				startWidth.clear();
				endWidth.clear();
			}

			iAttr.setStartWidth(startIndex);
			iAttr.setEndWidth(endIndex);

			dAttr.setProcess(Attr.PROCESS_FILTER);
			super.modifyAttr(Attr.DATA_ATTR, dAttr);

			iAttr.setProcess(Attr.PROCESS_FILTER);
			super.modifyAttr(Attr.INDEX_ATTR, iAttr);
			return super.getAttrSet();
		}
		else{
			return null;
			// Error Message..
		}
	}
	
	protected boolean compare(byte[] src, byte[] target){
		
		if(src.length == target.length){
			int chk = 0;
			for(int i=0;i<src.length;i++){
				if(src[i] == target[i]){
					chk++;
				}
				else{
					break;
				}
			}
			if(chk == src.length){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	}
	
	abstract protected byte[] process(byte[] data, List<Integer> startWidth, List<Integer> endWidth);
}
