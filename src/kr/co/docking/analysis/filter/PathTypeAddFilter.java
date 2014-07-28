package kr.co.docking.analysis.filter;

import kr.co.docking.analysis.analysis.DockingAnalyzer;
import kr.co.docking.analysis.attribute.Attr;
import kr.co.docking.analysis.attribute.DataAttribute;


public class PathTypeAddFilter extends Filter{
	
	private String destPath;
	private String rscPath;

	public PathTypeAddFilter(DockingAnalyzer stream) {
		this(stream,"","");
		// TODO Auto-generated constructor stub
	}
	public PathTypeAddFilter(DockingAnalyzer stream,String destPath,String rscPath) {
		super(stream);
		this.destPath = destPath;
		this.rscPath = rscPath;
		// TODO Auto-generated constructor stub
	}
	
	public String getDestPath() {
		return destPath;
	}
	public void setDestPath(String destPath) {
		this.destPath = destPath;
	}
	public String getRscPath() {
		return rscPath;
	}
	public void setRscPath(String rscPath) {
		this.rscPath = rscPath;
	}

	@SuppressWarnings("unused")
	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		
		DataAttribute dAttr = null;

		dAttr = (DataAttribute)this.addAttribute(Attr.ATTRSET_FILE_DATA, DataAttribute.class);

		if(dAttr != null){

			dAttr = (DataAttribute)super.getStream().getAttrSet().get(Attr.ATTRSET_FILE_DATA);

			byte[][] data = dAttr.getData();
			byte[][] type = dAttr.getType();
			byte[] destData = destPath.getBytes();
			byte[] rscData = rscPath.getBytes();
			byte[] tData = null;
					
			int chk = 0;
			int len = 0;
			int tLen = 0;
			
			for(int i=0;i<data.length;i++){
				for(int j=0;j<data[i].length;j++){
					if(data[i][j] == rscData[0]){
						chk++;
						for(int k=1;k<rscData.length;k++){
							if(data[i][j+k] == rscData[k]){
								chk++;
							}
							else{
								chk = 0;
								break;
							}
						}
						int dotChk = 0;
						int lastIndex = 0;
						if(chk == rscData.length){
							if(data[i][j+chk] == '.'){
									dotChk = 0;
							}
							else{
							for(int k=j+chk;;k++){
								if(data[i][k] == '.' && data[i][k+1] != '/'){
									/*if(data[i][k+1] != '/'){*/
										dotChk++;
									/*}*/
								}
								else if(data[i][k] == '"' || k == data[i].length){
									lastIndex = k;
									break;
								}
							}
							}
						}
						if(dotChk > 0){
							tLen = j+chk;
							len = lastIndex-tLen;
							tData = new byte[data[i].length+destData.length];
							for(int k=0;k<tLen;k++){
								tData[k] = data[i][k];
							}
							for(int k=tLen,n=0;n<destData.length;k++,n++){
								tData[k] = destData[n];
							}
							for(int k=tLen+destData.length,n=tLen;k<tData.length||n<data[i].length;k++,n++){
								tData[k] = data[i][n];
							}
							data[i] = tData;
						}
					}
					chk = 0;len = 0;tLen = 0;
				}
			}
			
			dAttr.setData(data);
			dAttr.setType(type);
			dAttr.setProcess(Attr.PROCESS_FILTER);
			
			this.getAttrSet().put(Attr.ATTRSET_FILE_DATA, dAttr);
		}
		else{
			// Error Message..
		}
	}

}
