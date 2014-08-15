package org.docking.erbse.analysis.filter;

import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;
import org.docking.erbse.analysis.attribute.IndexAttribute;

public abstract class DataProcessFilter extends Filter {

	private byte[][] preData;
	private byte[][] postData;
	
	public DataProcessFilter(DockingAnalyzer stream, byte[][] preData, byte[][] postData) {
		super(stream);
		this.preData = preData;
		this.postData = postData;
		// TODO Auto-generated constructor stub
	}

	public byte[][] getPreData() {
		return preData;
	}

	public void setPreData(byte[][] preData) {
		this.preData = preData;
	}

	public byte[][] getPostData() {
		return postData;
	}

	public void setPostData(byte[][] postData) {
		this.postData = postData;
	}
	
	@Override
	public void analyze() {
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
				data[i] = this.dataCheck(data[i],startWidth,endWidth);

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
	
	private byte[] dataCheck(byte[] data, List<Integer> startWidth, List<Integer> endWidth) {
		byte[] dataTmp = data;
		byte[] tmp = dataTmp;

		boolean cmp = false;
		int valCnt = 0;

		for(int i=0;i<dataTmp.length;i++){
			for(int j=0;j<preData.length;j++){
				if(dataTmp[i] == preData[j][0]){
					tmp = new byte[preData[j].length];	// updateTmp[i] 가 preData와 첫글자가 일치하면 데이터를 비교
					System.arraycopy(preData[j], 0, tmp, 0, preData[j].length);
					cmp = this.compare(tmp, preData[j]);

					if(cmp == true){

						valCnt = 0;
						for(int k=i+preData[j].length;k<dataTmp.length;k++,valCnt++){
							if(dataTmp[k] == postData[j][0]){
								tmp = new byte[postData[j].length];
								System.arraycopy(postData[j], 0, tmp, 0, postData[j].length);
								cmp = this.compare(tmp, postData[j]);
								
								if(cmp == true){
									tmp = this.process(dataTmp, i, j, valCnt);

									startWidth.add(i);
									endWidth.add(i+valCnt);
								}
							}
						}
					}
					else{
						/*
						 * postData 발견 못 한 경우..
						 */
					}
				}
			}
			dataTmp = tmp;
		}
		return dataTmp;
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
	
	abstract protected byte[] process(byte[] data, int dataIndex, int srcIndex, int targetIndex);
}
