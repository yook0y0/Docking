package org.docking.erbse.analysis.filter.processImpl;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.filter.process.MedianDataProcessFilter;

public class MedianDataUpdateFilter extends MedianDataProcessFilter {

	private byte[][] targetData;
	private byte[][] updateData;

	public MedianDataUpdateFilter(DockingAnalyzer stream, byte[][] preData, byte[][] postData, byte[][] updateData) {
		this(stream,preData,postData,null,updateData);
	}

	public MedianDataUpdateFilter(DockingAnalyzer stream, byte[][] preData, byte[][] postData,byte[][] targetData, byte[][] updateData) {
		super(stream,preData,postData);
		this.targetData = targetData;
		this.updateData = updateData;
	}

	public byte[][] getTargetData() {
		return this.targetData;
	}

	public void setTargetData(byte[][] targetData) {
		this.targetData = targetData;
	}

	public byte[][] getUpdateData() {
		return this.updateData;
	}

	public void setUpdateData(byte[][] updateData) {
		this.updateData = updateData;
	}

	protected byte[] operate(byte[] data, int dataIndex, int srcIndex, int targetIndex){

		byte[] targetSrc = null;
		if(this.targetData != null){
			targetSrc = this.targetData[srcIndex];
		}
		byte[] updateSrc = this.updateData[srcIndex];
		byte[] preData = super.getPreData()[srcIndex];
		byte[] tmp = null;

		int pre = dataIndex+preData.length;

		if(targetSrc == null){
			tmp = updateSrc;
		}
		else{
			byte[] targetValue = new byte[targetIndex];

			boolean cmp = false;

			System.arraycopy(data, pre, targetValue, 0, targetIndex);
			for(int i=0;i<targetValue.length;i++){
				if(targetValue[i] == targetSrc[0]){
					tmp = new byte[targetSrc.length];

					System.arraycopy(targetValue, i, tmp, 0, targetSrc.length);
					cmp = super.compare(tmp, targetSrc);

					if(cmp == true){
						tmp = new byte[targetValue.length - targetSrc.length + updateSrc.length];

						System.arraycopy(targetValue, 0, tmp, 0, i);
						System.arraycopy(updateSrc, 0, tmp, i, updateSrc.length);
						System.arraycopy(targetValue, i+targetSrc.length, tmp, i+updateSrc.length, (targetValue.length-i-targetSrc.length));
					}
					else{
						tmp = updateSrc;
					}
				}
			}
		}

		byte[] res = new byte[data.length+tmp.length-targetIndex];
		System.arraycopy(data, 0, res, 0, pre);
		System.arraycopy(tmp, 0, res, pre, tmp.length);
		System.arraycopy(data, pre+targetIndex, res, pre+tmp.length, data.length-(pre+targetIndex));
		return res;
	}
}