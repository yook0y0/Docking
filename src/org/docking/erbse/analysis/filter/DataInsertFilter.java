package org.docking.erbse.analysis.filter;

import org.docking.erbse.analysis.DockingAnalyzer;

public class DataInsertFilter extends DataProcessFilter {

	private byte[][] insertData;
	
	public DataInsertFilter(DockingAnalyzer stream, byte[][] preData,
			byte[][] postData, byte[][] insertData) {
		super(stream, preData, postData);
		this.insertData = insertData;
	}

	public byte[][] getInsertData() {
		return insertData;
	}

	public void setInsertData(byte[][] insertData) {
		this.insertData = insertData;
	}

	@Override
	protected byte[] process(byte[] data, int dataIndex, int srcIndex,
			int targetIndex) {
		// TODO Auto-generated method stub
		if(targetIndex == 0){
			/*
			 * pre , post data 사이에 값이 없을 경우 그 사이에 Insert
			 */
			byte[] insertSrc = this.insertData[srcIndex];
			byte[] preData = super.getPreData()[srcIndex];
			byte[] res = new byte[data.length+insertSrc.length];
			
			int pre = dataIndex+preData.length;
			System.arraycopy(data, 0, res, 0, pre);
			System.arraycopy(insertSrc, 0, res, pre, insertSrc.length);
			System.arraycopy(data, pre, res, pre+insertSrc.length, data.length-pre);
			
			return res;
		}
		else{
			return data;
		}
	}

}
