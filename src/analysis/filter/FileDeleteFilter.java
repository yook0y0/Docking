package analysis.filter;

import java.io.File;

import analysis.DockingAnalyzer;
import analysis.attribute.Attr;
import analysis.attribute.DataAttribute;

public class FileDeleteFilter extends Filter {

	public FileDeleteFilter(DockingAnalyzer stream) {
		super(stream);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub

		DataAttribute dAttr = null;

		String getData = null;
		File file = null;
		dAttr = (DataAttribute)this.getStream().getAttrSet().get(Attr.ATTRSET_FILE_DATA);

		if(dAttr != null){

			if(dAttr.getProcess() == Attr.PROCESS_REGISTER){
				getData = new String(dAttr.getData()[0]);
				file = new File(getData);
				this.delFile(file);
			}
			else {
				// Error Message..
			}
		}
		else{
			// Error Message..
		}
	}

	private void delFile(File file) {
		File[] files = file.listFiles();
		if(files == null){
			file.delete();
		}
		else{
			for(int i=0; i< files.length;i++){
				if(files[i].isFile()){
					files[i].delete();
					continue;
				}
				if(files[i].isDirectory()){
					delFile(files[i]);
				}
				files[i].delete();
			}
			file.delete();
		}
	}
}