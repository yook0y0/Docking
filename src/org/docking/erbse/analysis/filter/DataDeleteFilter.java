package org.docking.erbse.analysis.filter;

import org.docking.erbse.analysis.DockingAnalyzer;

public class DataDeleteFilter extends DataProcessFilter {
	
	private byte[][] targetData;
	
	public DataDeleteFilter(DockingAnalyzer stream, byte[][] preData, byte[][] postData){
		this(stream,preData,postData,null);
	}

	public DataDeleteFilter(DockingAnalyzer stream, byte[][] preData,
			byte[][] postData, byte[][] targetData) {
		super(stream, preData, postData);
		this.targetData = targetData;
		// TODO Auto-generated constructor stub
	}
	
	public byte[][] getTargetData(){
		return this.targetData;
	}
	
	public void setTargetData(byte[][] targetData){
		this.targetData = targetData;
	}

	protected byte[] process(byte[] data, int dataIndex, int srcIndex, int targetIndex){

		byte[] targetSrc = null;
		if(this.targetData != null){
			targetSrc = this.targetData[srcIndex];
		}
		
		byte[] preData = super.getPreData()[srcIndex];
		byte[] tmp = null;

		int pre = dataIndex+preData.length;

		if(targetSrc != null){
			byte[] targetValue = new byte[targetIndex];

			boolean cmp = false;

			System.arraycopy(data, pre, targetValue, 0, targetIndex);
			for(int i=0;i<targetValue.length;i++){
				if(targetValue[i] == targetSrc[0]){
					tmp = new byte[targetSrc.length];

					System.arraycopy(targetValue, i, tmp, 0, targetSrc.length);
					cmp = super.compare(tmp, targetSrc);

					if(cmp == true){
						tmp = new byte[targetValue.length - targetSrc.length];

						System.arraycopy(targetValue, 0, tmp, 0, i);
						System.arraycopy(targetValue, i+targetSrc.length, tmp, i, targetValue.length-(i+targetSrc.length));
					}
				}
			}
		}
		
		byte[] res = null;
		
		if(tmp != null){
			res = new byte[data.length+tmp.length-targetIndex];
			System.arraycopy(data, 0, res, 0, pre);
			System.arraycopy(tmp, 0, res, pre, tmp.length);
			System.arraycopy(data, pre+targetIndex, res, pre+tmp.length, data.length-(pre+targetIndex));
		}
		else{
			res = new byte[data.length-targetIndex];
			System.arraycopy(data, 0, res, 0, pre);
			System.arraycopy(data, pre+targetIndex, res, pre, data.length-(pre+targetIndex));
		}

		return res;
	}
}