package org.docking.erbse.analysis.filter;

import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;
import org.docking.erbse.analysis.attribute.IndexAttribute;

public class DataCheckAppendFilter extends Filter {

	private byte[][] srcData;
	private byte[][] chkData;

	public DataCheckAppendFilter(DockingAnalyzer stream,byte[][] srcData, byte[][] chkData) {
		super(stream);
		this.srcData = srcData;
		this.chkData = chkData;
	}

	public byte[][] getSrcData() {
		return srcData;
	}

	public void setSrcData(byte[][] srcData) {
		this.srcData = srcData;
	}

	public byte[][] getChkData() {
		return chkData;
	}

	public void setChkData(byte[][] chkData) {
		this.chkData = chkData;
	}

	@Override
	public void analyze() {
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
				data[i] = this.append(data[i],startWidth,endWidth);

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
		}
		else{
			// Error Message..
		}
	}

	private byte[] append(byte[] data,List<Integer> startWidth,List<Integer> endWidth){

		int chk = 0;

		byte[] dataArr = data;
		byte[] bArr = null;

		for(int i=0,index=0;i<dataArr.length;i++,index++){
			System.out.println("index : " + index);
			for(int j=0;j<this.srcData.length;j++){
				if(dataArr[i] == this.srcData[j][0]){
					for(int k=1;k<this.srcData[j].length;k++){
						if(dataArr[i+k] != this.srcData[j][k]){
							break;
						}
						else{
							chk++;
						}
					}
					if(chk == this.srcData[j].length-1){
						if(dataArr[i+chk] != this.chkData[j][0]){
							bArr = new byte[dataArr.length+this.chkData[j].length];
							System.arraycopy(dataArr, 0, bArr, 0, i+this.srcData[j].length);
							System.arraycopy(this.chkData[j], 0, bArr, i+this.srcData[j].length, this.chkData[j].length);
							System.arraycopy(dataArr, i+this.srcData[j].length, bArr, i+this.chkData[j].length+this.srcData[j].length, dataArr.length-(i+this.srcData[j].length));
						}
						
						startWidth.add(index);
						endWidth.add(index+this.srcData[j].length-1);

						dataArr = bArr;
					}
					chk = 0;
				}
			}
		}

		return dataArr;
	}
}
