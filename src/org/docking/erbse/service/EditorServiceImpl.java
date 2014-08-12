package org.docking.erbse.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.file.FileManager;
import org.docking.erbse.util.GlobalVariable;
import org.docking.erbse.util.Injector;
import org.docking.erbse.util.JsonParser;
import org.docking.erbse.vo.EditorCodeVO;
import org.docking.erbse.vo.EditorExecuteInfoVO;
import org.docking.erbse.vo.EditorReviewBBSVO;
import org.docking.erbse.vo.EditorVO;


public class EditorServiceImpl implements EditorService {

	@Override
	public Integer editorAdd(String path, EditorVO editor, EditorExecuteInfoVO editorExecuteInfo) {
		// TODO Auto-generated method stub

		Integer res = 0;

		FileManager fm = (FileManager)Injector.getInstance().getObject(FileManager.class);
		//int unzipRes = fm.unZip(path);

		GenericService<EditorVO>	editService = new GenericServiceImpl<EditorVO>();
		res += editService.add("editor_add", editor);

		//EditorCodeVO ecvo = null;
		List<EditorCodeVO> ecvoList = new ArrayList<EditorCodeVO>();

		File[] files = null;
		try {
			files = fm.fileStructureChk(fm.fileNameChk(path));
			for(int i=0;i<files.length;i++){
				this.fileChk(files[i], editor.getEditorId(), ecvoList);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		res = editCodeService.add("editorCode_add", ecvoList);
		
		GenericService<EditorExecuteInfoVO>	editorExecuteInfoService = new GenericServiceImpl<EditorExecuteInfoVO>();
		res += editorExecuteInfoService.add("editorExecute_add", editorExecuteInfo);

		fm.delete(path);

		return res;
	}

	private void fileChk(File file, String editorId, List<EditorCodeVO> ecvoList) throws IOException{
		FileManager fm = (FileManager) Injector.getInstance().getObject(FileManager.class);
		EditorCodeVO ecvo = null;

		if(file.isDirectory()){
			File[] files = fm.fileStructureChk(file);
			for(int i=0;i<files.length;i++){
				fileChk(files[i],editorId,ecvoList);
			}
		}
		else{
			ecvo = new EditorCodeVO();
			ecvo.setEditorId(editorId);
			ecvo.setCode(new String(fm.read(file)));
			ecvo.setPath(editorId + "/" + file.getName());
			ecvoList.add(ecvo);
		}
	}

	@Override
	public Integer editorModify(EditorVO editor , EditorExecuteInfoVO editorExecuteInfo) 
	{
		GenericService<EditorVO>	eService = new GenericServiceImpl<EditorVO>();
		GenericService<EditorExecuteInfoVO>	eeService = new GenericServiceImpl<EditorExecuteInfoVO>();
		
		int	res = 0;
		
		res += eService.add("editor_modify", editor);
		res += eeService.add("editorExecute_modify", editorExecuteInfo);
		
		return res;
	}

	@Override
	public Integer editorDelete(String editorId) 
	{
		Integer res = 0;
		
		GenericService<EditorVO>	editService = new GenericServiceImpl<EditorVO>();
		res += editService.delete("editor_delete", editorId);

		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		res += editCodeService.delete("editorCode_deleteByEditorId", editorId);
		
		GenericService<EditorExecuteInfoVO>	eeService = new GenericServiceImpl<EditorExecuteInfoVO>();
		res += eeService.delete("editorExecute_delete", editorId);

		return res;
	}

	@Override
	public String editorSearch(String editorId) 
	{
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		EditorVO evo = genericService.search("editor_search", editorId);
		
		GenericService<EditorExecuteInfoVO>	eGenericService = new GenericServiceImpl<EditorExecuteInfoVO>();
		EditorExecuteInfoVO	eevo = eGenericService.search("editorExecute_search", editorId);

		String[] objName = new String[]{"modifyEditorVO"};

		/*
		 * DocumentVO Json
		 */
		String jEvo = JsonParser.getInstance().jParseObj(GlobalVariable.F_EDIT_VO_MODIFY, new String[]{evo.getEditorId(),evo.getDescription(),eevo.getStartPage(),eevo.getSetMethod(),eevo.getGetMethod(),String.valueOf(eevo.getUseRange()),String.valueOf(evo.getEditorType())});

		return JsonParser.getInstance().jParseObj(objName,new String[]{jEvo});
	}
	
	public String editorSearchAll()
	{
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		List<EditorVO> eList = genericService.searchAll("editor_searchAll");
		
		List<String> tmpList = new ArrayList<String>();

		String[] objName = new String[]{"editorVO"};
		
		for(EditorVO evo : eList)
		{
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.EDIT_VO_FIELD, new String[]{evo.getEditorId(),evo.getDirector(),evo.getDescription(),String.valueOf(evo.getEditorType())}));
		}
		
		String[] evoArr = new String[eList.size()];
		evoArr = tmpList.toArray(evoArr);
		String jErvoList = JsonParser.getInstance().jParseArr(evoArr);

		return JsonParser.getInstance().jParseObj(objName,new String[]{jErvoList});
	}

	@Override
	public String ownEditorList(String director) 
	{
		GenericService<EditorVO>	editService = new GenericServiceImpl<EditorVO>();
		List<EditorVO> evoList = editService.searchAll("editor_searchAll_key", director);
		
		List<EditorReviewBBSVO>	tempErvoList = null;

		List<String> tmpList = new ArrayList<String>();

		String[] objName = new String[]{"EditorVO"};
		Double	totalScore;

		for(EditorVO evo : evoList)
		{
			totalScore = 0.0;
			tempErvoList = reviewListForTotalScore(evo.getEditorId());
			
			for(EditorReviewBBSVO ervo : tempErvoList)
			{
				totalScore += ervo.getScore();
			}
			
			if(!(tempErvoList.size() == 0))
			{
				totalScore /= tempErvoList.size();
			}
			
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.EDIT_VO_FIELD, new String[]{evo.getEditorId(),evo.getDirector(),evo.getDescription(),String.valueOf(evo.getEditorType()),String.valueOf(totalScore),String.valueOf(tempErvoList.size())}));
		}
		
		String[] evoArr = new String[evoList.size()];
		evoArr = tmpList.toArray(evoArr);
		String jEvoList = JsonParser.getInstance().jParseArr(evoArr);
		
		return JsonParser.getInstance().jParseObj(objName,new String[]{jEvoList});
	}
	
	private List<EditorReviewBBSVO> reviewListForTotalScore(String editorId)
	{
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		
		return reviewService.searchAll("editorReview_searchAll_key", editorId);
	}

	@Override
	public Integer editorCodeAdd(EditorCodeVO editorCode) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editService = new GenericServiceImpl<EditorCodeVO>();
		Integer res = editService.add("editorCode_add", editorCode);

		return res;
	}

	@Override
	public Integer editorCodeModify(EditorCodeVO editorCode) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		Integer res = genericService.modify("editorCode_modify", editorCode);
		
		return res;
	}

	@Override
	public String editorCodeSearch(String path) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		EditorCodeVO ecvo = editCodeService.search("editorCode_search", path);

		String[] objName = new String[]{"editorCodeVO"};

		/*
		 * DocumentVO Json
		 */
		String jEcvo = JsonParser.getInstance().jParseObj(GlobalVariable.EDITCODE_VO_FIELD, new String[]{ecvo.getEditorId(),ecvo.getCode(),ecvo.getPath()});

		return JsonParser.getInstance().jParseObj(objName,new String[]{jEcvo});
	}

	@Override
	public Integer editorCodeDelete(String path) {
		// TODO Auto-generated method stub
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		Integer res = editCodeService.delete("editorCode_delete", path);

		return res;
	}

	@Override
	public String codeList(String editorId) 
	{
		GenericService<EditorCodeVO>	editCodeService = new GenericServiceImpl<EditorCodeVO>();
		List<EditorCodeVO> ecvoList = editCodeService.searchAll("editorCode_searchAll_key", editorId);

		List<String> tmpList = new ArrayList<String>();

		String[] objName = new String[]{"EditorCodeVOList"};

		for(EditorCodeVO ecvo : ecvoList){
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.EDITCODE_VO_FIELD, new String[]{ecvo.getEditorId(),ecvo.getCode(),ecvo.getPath()}));
		}
		String[] ecvoArr = new String[ecvoList.size()];
		ecvoArr = tmpList.toArray(ecvoArr);
		String jEcvoList = JsonParser.getInstance().jParseArr(ecvoArr);

		return JsonParser.getInstance().jParseObj(objName,new String[]{jEcvoList});
	}
}
